package com.roomfms.dto;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class JwtResponse {
    private String token;
    private Long id;
    private String name;
    private String mobile;
    private String role;
}
