package com.eiu.testlab.fade.entity;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.*;

@Entity
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@Data
@DiscriminatorValue("MEDIA")
public class MediaPost extends Post{
}
