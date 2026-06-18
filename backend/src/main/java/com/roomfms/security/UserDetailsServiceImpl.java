package com.roomfms.security;

import com.roomfms.entity.User;
import com.roomfms.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;
import java.util.Collections;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String mobile) throws UsernameNotFoundException {
        User user = userRepository.findByMobile(mobile)
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found with mobile: " + mobile));

        return new org.springframework.security.core.userdetails.User(
                user.getMobile(),
                user.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()))
        );
    }
}
