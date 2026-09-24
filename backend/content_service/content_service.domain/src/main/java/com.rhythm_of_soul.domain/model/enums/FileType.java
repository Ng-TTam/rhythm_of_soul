package com.rhythm_of_soul.domain.model.enums;

public enum FileType {
    SONG,
    IMAGE,
    COVER;

    public static FileType fromString(String type) {
        if (type == null) return null;
        for (FileType fileType : FileType.values()) {
            if (fileType.name().equalsIgnoreCase(type)) {
                return fileType;
            }
        }
        return null;
    }
}
