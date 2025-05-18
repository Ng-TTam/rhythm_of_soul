package com.rhythm_of_soul.content_service.mapper;

import com.rhythm_of_soul.content_service.dto.ContentResponse;
import com.rhythm_of_soul.content_service.dto.PostResponse;
import com.rhythm_of_soul.content_service.dto.request.PostRequest;
import com.rhythm_of_soul.content_service.entity.Post;
import org.mapstruct.Mapper;

import java.time.Instant;
import java.util.UUID;

@Mapper(componentModel = "spring")
public interface PostMapper {

    default PostResponse toPostResponse(Post post) {
        ContentResponse contentResponse = null;
        if(post.getContent() != null) {
             contentResponse = ContentResponse.builder()
                    .originalPostId(post.getContent().getOriginalPostId())
                    .title(post.getContent().getTitle())
                    .mediaUrl(post.getContent().getMediaUrl())
                    .tags(post.getContent().getTags())
                    .build();
        }

        return PostResponse.builder()
                .id(post.getId())
                .type(post.getType().name())
                .caption(post.getCaption())
                .content(contentResponse)
                .view_count(post.getViewCount())
                .like_count(post.getLikeCount())
                .comment_count(post.getCommentCount())
                .is_public(post.isPublic())
                .created_at(post.getCreatedAt() != null ? post.getCreatedAt() : null)
                .updated_at((post.getUpdatedAt() != null) ? post.getUpdatedAt() : null)
                .scheduled_at(post.getScheduledAt() != null ? post.getScheduledAt() : null)
                .account_id(post.getAccountId())
                .build();
    }
    default Post toPost(PostRequest postRequest){
        return Post.builder()
                .id(UUID.randomUUID().toString())
                .type(postRequest.getType())
                .caption(postRequest.getCaption())
                .isPublic(postRequest.getIsPublic())
                .likeCount(0)
                .commentCount(0)
                .viewCount(0)
                .createdAt(Instant.now())
                .updatedAt(null)
                .scheduledAt(null)
                .build();
    }
}

