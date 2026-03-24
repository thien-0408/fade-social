package com.eiu.testlab.fade.dto.User;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ChangePasswordDto {
    String currentPassword;
    String newPassword;
}
