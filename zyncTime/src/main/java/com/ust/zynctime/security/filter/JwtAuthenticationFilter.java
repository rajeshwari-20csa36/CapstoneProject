package com.ust.zynctime.security.filter;




import com.ust.zynctime.security.service.ApiUserService;
import com.ust.zynctime.security.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final ApiUserService apiUserService;

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain) throws ServletException, IOException {
        log.info("Processing authentication for '{}'", request.getRequestURL());
        // Authorization    Bearer <jwt-token>
        String header = request.getHeader("Authorization");
        log.info("Authorization header: '{}'", header);
        // Check if the header is null or does not start with Bearer
        if (header == null || !header.startsWith("Bearer ")) {
            log.warn("Invalid Authorization header");
            filterChain.doFilter(request, response);
            return;
        }

        // Extract the token from the header
        String token = header.replace("Bearer ", "");
        log.info("Token: '{}'", token);

        // Validate the token
        // If the token is invalid, return a 401 Unauthorized response
        boolean isValid = jwtService.validateToken(token);
        log.info("Token is valid: '{}'", isValid);
        if(!isValid){
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }
        // If the token is valid, set the authentication in the SecurityContext
        // and proceed with the filter chain
        String username = jwtService.extractUsername(token);
        log.info("Username: '{}'", username);
        if(username == null){
            filterChain.doFilter(request, response);
            return;
        }
        UserDetails userDetails = apiUserService.loadUserByUsername(username);
        UsernamePasswordAuthenticationToken authToken = UsernamePasswordAuthenticationToken
                .authenticated(userDetails, null, userDetails.getAuthorities());
        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        SecurityContextHolder.getContext().setAuthentication(authToken);

        filterChain.doFilter(request, response);
    }
}
