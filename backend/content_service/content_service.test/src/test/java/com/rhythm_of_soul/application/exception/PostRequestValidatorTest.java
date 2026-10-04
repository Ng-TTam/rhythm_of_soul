package com.rhythm_of_soul.application.exception;

import com.rhythm_of_soul.application.model.request.ContentRequest;
import com.rhythm_of_soul.application.model.request.PostRequest;
import com.rhythm_of_soul.domain.model.enums.Type;
import com.rhythm_of_soul.domain.model.enums.Tag;
import jakarta.validation.ConstraintValidatorContext;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PostRequestValidatorTest {

    private PostRequestValidator validator;

    @Mock
    private ConstraintValidatorContext context;

    @Mock
    private ConstraintValidatorContext.ConstraintViolationBuilder builder;

    @Mock
    private ConstraintValidatorContext.ConstraintViolationBuilder.NodeBuilderCustomizableContext nodeBuilder;

    @BeforeEach
    void setUp() {
        validator = new PostRequestValidator();
    }

    private void mockContext() {
        doNothing().when(context).disableDefaultConstraintViolation();
        lenient().when(context.buildConstraintViolationWithTemplate(anyString())).thenReturn(builder);
        lenient().when(builder.addPropertyNode(anyString())).thenReturn(nodeBuilder);
        lenient().when(nodeBuilder.addConstraintViolation()).thenReturn(context);
    }

    // ===== Null / Type null =====

    @Test
    @DisplayName("null request returns true (handled by @NotNull)")
    void isValid_NullRequest_ReturnsTrue() {
        assertTrue(validator.isValid(null, context));
    }

    @Test
    @DisplayName("type is null returns false")
    void isValid_TypeNull_ReturnsFalse() {
        mockContext();
        PostRequest req = PostRequest.builder().build();
        assertFalse(validator.isValid(req, context));
        verify(context).buildConstraintViolationWithTemplate("Type must not be null");
    }

    // ===== Type TEXT =====

    @Nested
    @DisplayName("Type TEXT")
    class TextTests {

        @Test
        @DisplayName("valid caption returns true")
        void text_ValidCaption_ReturnsTrue() {
            mockContext();
            PostRequest req = PostRequest.builder()
                    .type(Type.TEXT)
                    .caption("Hello world")
                    .build();
            assertTrue(validator.isValid(req, context));
        }

        @Test
        @DisplayName("caption is null returns false")
        void text_NullCaption_ReturnsFalse() {
            mockContext();
            PostRequest req = PostRequest.builder()
                    .type(Type.TEXT)
                    .caption(null)
                    .build();
            assertFalse(validator.isValid(req, context));
            verify(context).buildConstraintViolationWithTemplate("Caption must not be blank when type is TEXT");
        }

        @Test
        @DisplayName("caption is blank returns false")
        void text_BlankCaption_ReturnsFalse() {
            mockContext();
            PostRequest req = PostRequest.builder()
                    .type(Type.TEXT)
                    .caption("   ")
                    .build();
            assertFalse(validator.isValid(req, context));
        }

        @Test
        @DisplayName("type TEXT with content provided is valid because TEXT only requires caption")
        void text_WithContentProvided_StillValid() {
            mockContext();
            ContentRequest content = ContentRequest.builder()
                    .title("Song title")
                    .mediaUrl("http://song.mp3")
                    .build();
            PostRequest req = PostRequest.builder()
                    .type(Type.TEXT)
                    .caption("My caption")
                    .content(content)
                    .build();
            assertTrue(validator.isValid(req, context));
        }
    }

    // ===== Type SONG =====

    @Nested
    @DisplayName("Type SONG")
    class SongTests {

        @Test
        @DisplayName("full content with title and mediaUrl returns true")
        void song_FullContent_ReturnsTrue() {
            mockContext();
            ContentRequest content = ContentRequest.builder()
                    .title("My Song")
                    .mediaUrl("http://media.com/song.mp3")
                    .coverUrl("http://cover.jpg")
                    .imageUrl("http://image.jpg")
                    .tags(List.of(Tag.POP))
                    .build();
            PostRequest req = PostRequest.builder()
                    .type(Type.SONG)
                    .content(content)
                    .build();
            assertTrue(validator.isValid(req, context));
        }

        @Test
        @DisplayName("content is null returns false")
        void song_NullContent_ReturnsFalse() {
            mockContext();
            PostRequest req = PostRequest.builder()
                    .type(Type.SONG)
                    .content(null)
                    .build();
            assertFalse(validator.isValid(req, context));
            verify(context).buildConstraintViolationWithTemplate("Content must not be null when type is SONG");
        }

        @Test
        @DisplayName("type SONG with text-like data returns false")
        void song_MissingTitleAndMedia_ReturnsFalse() {
            mockContext();
            ContentRequest content = ContentRequest.builder().build(); // empty
            PostRequest req = PostRequest.builder()
                    .type(Type.SONG)
                    .caption("This is text-like data")
                    .content(content)
                    .build();
            assertFalse(validator.isValid(req, context));
            verify(context).buildConstraintViolationWithTemplate("Title must not be blank when type is SONG");
            verify(context).buildConstraintViolationWithTemplate("Media URL must not be blank when type is SONG");
        }

        @Test
        @DisplayName("type SONG missing mediaUrl returns false")
        void song_MissingMediaUrl_ReturnsFalse() {
            mockContext();
            ContentRequest content = ContentRequest.builder()
                    .title("My Song")
                    .build();
            PostRequest req = PostRequest.builder()
                    .type(Type.SONG)
                    .content(content)
                    .build();
            assertFalse(validator.isValid(req, context));
            verify(context).buildConstraintViolationWithTemplate("Media URL must not be blank when type is SONG");
        }

        @Test
        @DisplayName("type SONG missing title returns false")
        void song_MissingTitle_ReturnsFalse() {
            mockContext();
            ContentRequest content = ContentRequest.builder()
                    .mediaUrl("http://media.com/song.mp3")
                    .build();
            PostRequest req = PostRequest.builder()
                    .type(Type.SONG)
                    .content(content)
                    .build();
            assertFalse(validator.isValid(req, context));
            verify(context).buildConstraintViolationWithTemplate("Title must not be blank when type is SONG");
        }
    }

    // ===== Type ALBUM =====

    @Nested
    @DisplayName("Type ALBUM")
    class AlbumTests {

        @Test
        @DisplayName("valid content returns true")
        void album_ValidContent_ReturnsTrue() {
            mockContext();
            ContentRequest content = ContentRequest.builder()
                    .title("My Album")
                    .songIds(List.of("song-1", "song-2"))
                    .build();
            PostRequest req = PostRequest.builder()
                    .type(Type.ALBUM)
                    .content(content)
                    .build();
            assertTrue(validator.isValid(req, context));
        }

        @Test
        @DisplayName("content is null returns false")
        void album_NullContent_ReturnsFalse() {
            mockContext();
            PostRequest req = PostRequest.builder()
                    .type(Type.ALBUM)
                    .content(null)
                    .build();
            assertFalse(validator.isValid(req, context));
        }

        @Test
        @DisplayName("type ALBUM missing title returns false")
        void album_MissingTitle_ReturnsFalse() {
            mockContext();
            ContentRequest content = ContentRequest.builder()
                    .songIds(List.of("song-1"))
                    .build();
            PostRequest req = PostRequest.builder()
                    .type(Type.ALBUM)
                    .content(content)
                    .build();
            assertFalse(validator.isValid(req, context));
            verify(context).buildConstraintViolationWithTemplate("Title must not be blank when type is ALBUM or PLAYLIST");
        }

        @Test
        @DisplayName("type ALBUM with text-like data returns false")
        void album_TextLikeData_ReturnsFalse() {
            mockContext();
            ContentRequest content = ContentRequest.builder().build();
            PostRequest req = PostRequest.builder()
                    .type(Type.ALBUM)
                    .caption("Text-like caption")
                    .content(content)
                    .build();
            assertFalse(validator.isValid(req, context));
        }
    }

    // ===== Type PLAYLIST =====

    @Nested
    @DisplayName("Type PLAYLIST")
    class PlaylistTests {

        @Test
        @DisplayName("valid content returns true")
        void playlist_ValidContent_ReturnsTrue() {
            mockContext();
            ContentRequest content = ContentRequest.builder()
                    .title("Chill Vibes")
                    .build();
            PostRequest req = PostRequest.builder()
                    .type(Type.PLAYLIST)
                    .content(content)
                    .build();
            assertTrue(validator.isValid(req, context));
        }

        @Test
        @DisplayName("type PLAYLIST missing title returns false")
        void playlist_MissingTitle_ReturnsFalse() {
            mockContext();
            ContentRequest content = ContentRequest.builder().build();
            PostRequest req = PostRequest.builder()
                    .type(Type.PLAYLIST)
                    .content(content)
                    .build();
            assertFalse(validator.isValid(req, context));
        }
    }

    // ===== Type REPOST =====

    @Nested
    @DisplayName("Type REPOST")
    class RepostTests {

        @Test
        @DisplayName("valid originalPostId returns true")
        void repost_ValidOriginalPostId_ReturnsTrue() {
            mockContext();
            ContentRequest content = ContentRequest.builder()
                    .originalPostId("post-original-123")
                    .build();
            PostRequest req = PostRequest.builder()
                    .type(Type.REPOST)
                    .content(content)
                    .build();
            assertTrue(validator.isValid(req, context));
        }

        @Test
        @DisplayName("content is null returns false")
        void repost_NullContent_ReturnsFalse() {
            mockContext();
            PostRequest req = PostRequest.builder()
                    .type(Type.REPOST)
                    .content(null)
                    .build();
            assertFalse(validator.isValid(req, context));
            verify(context).buildConstraintViolationWithTemplate("Content must not be null when type is REPOST");
        }

        @Test
        @DisplayName("type REPOST missing originalPostId returns false")
        void repost_MissingOriginalPostId_ReturnsFalse() {
            mockContext();
            ContentRequest content = ContentRequest.builder()
                    .title("Some title")
                    .build();
            PostRequest req = PostRequest.builder()
                    .type(Type.REPOST)
                    .content(content)
                    .build();
            assertFalse(validator.isValid(req, context));
            verify(context).buildConstraintViolationWithTemplate("Original post ID must not be blank when type is REPOST");
        }

        @Test
        @DisplayName("type REPOST with song-like data returns false")
        void repost_SongLikeData_ReturnsFalse() {
            mockContext();
            ContentRequest content = ContentRequest.builder()
                    .title("My Song")
                    .mediaUrl("http://song.mp3")
                    .build();
            PostRequest req = PostRequest.builder()
                    .type(Type.REPOST)
                    .content(content)
                    .build();
            assertFalse(validator.isValid(req, context));
        }
    }

    // ===== Cross-type mismatch cases =====

    @Nested
    @DisplayName("Cross-type Mismatch")
    class CrossTypeMismatchTests {

        @Test
        @DisplayName("type SONG with caption only returns false")
        void song_OnlyCaptionNoContent_ReturnsFalse() {
            mockContext();
            ContentRequest content = ContentRequest.builder().build();
            PostRequest req = PostRequest.builder()
                    .type(Type.SONG)
                    .caption("Just a text post")
                    .content(content)
                    .build();
            assertFalse(validator.isValid(req, context));
        }

        @Test
        @DisplayName("type ALBUM with song data returns false")
        void album_SongData_NoTitle_ReturnsFalse() {
            mockContext();
            ContentRequest content = ContentRequest.builder()
                    .mediaUrl("http://song.mp3")
                    .build();
            PostRequest req = PostRequest.builder()
                    .type(Type.ALBUM)
                    .content(content)
                    .build();
            assertFalse(validator.isValid(req, context));
        }

        @Test
        @DisplayName("type TEXT with song content but missing caption returns false")
        void text_SongContentButNoCaption_ReturnsFalse() {
            mockContext();
            ContentRequest content = ContentRequest.builder()
                    .title("Song title")
                    .mediaUrl("http://song.mp3")
                    .build();
            PostRequest req = PostRequest.builder()
                    .type(Type.TEXT)
                    .caption(null)
                    .content(content)
                    .build();
            assertFalse(validator.isValid(req, context));
        }

        @Test
        @DisplayName("type REPOST with album data returns false")
        void repost_AlbumData_ReturnsFalse() {
            mockContext();
            ContentRequest content = ContentRequest.builder()
                    .title("Album Name")
                    .songIds(List.of("s1", "s2"))
                    .build();
            PostRequest req = PostRequest.builder()
                    .type(Type.REPOST)
                    .content(content)
                    .build();
            assertFalse(validator.isValid(req, context));
        }
    }
}
