package com.eiu.testlab.fade.dto;

import com.eiu.testlab.fade.enums.Gender;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RegisterDto {
    String userName;
    String email;
    String password;
}
