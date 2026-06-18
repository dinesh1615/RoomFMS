package com.roomfms.dto;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginRequest {
    private String mobile;
    private String password;
}
