package com.rhythm_of_soul.application.model.request;

import com.rhythm_of_soul.domain.model.enums.Tag;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EditPostSong {
    String title;
    String coverUrl;
    String imageUrl;
    List<Tag> tags;
    String caption;
    Boolean  isPublic;

}
