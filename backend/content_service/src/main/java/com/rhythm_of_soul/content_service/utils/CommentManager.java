package com.rhythm_of_soul.content_service.utils;

import com.rhythm_of_soul.content_service.dto.response.CommentResponse;

import java.time.Instant;
import java.util.*;

public class CommentManager {
    private final Map<String, CommentResponse> commentMap = new HashMap<>();
    private final Map<String,CommentResponse> resultMap = new HashMap<>();
    // Method to add a department to the map
    public void addDepartment(String id, String accountId, String parentId, String content, Instant createdAt, Instant updatedAt,boolean userIsArtist) {

        if (commentMap.containsKey(id)) {
            return;
        }

        CommentResponse parentComment = null;

        if (parentId != null) {
            parentComment = commentMap.get(parentId);
            if (parentComment == null) {
                return;
            }
        }

        CommentResponse newComment = new CommentResponse(id, accountId, parentId, createdAt, updatedAt, content,userIsArtist);
        commentMap.put(id, newComment);

        if (parentComment != null) {
            parentComment.addSubComment(newComment);
        }else{
            resultMap.put(id,newComment);
        }
    }

    public List<CommentResponse> getAllDepartments() {
        return new ArrayList<>(resultMap.values());
    }

    public void addDepartment(String id, String accountId, String parentId, String content, Date from) {

    }
}
