package com.rhythm_of_soul.application.factory.file;

import com.rhythm_of_soul.domain.model.exception.AppException;
import com.rhythm_of_soul.domain.model.exception.ErrorCode;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Component
public class FileUploadFactory {
    private final Map<String, FileUploadStrategy> strategyMap;

    public FileUploadFactory(List<FileUploadStrategy> strategies) {
        this.strategyMap = strategies.stream()
                .collect(Collectors.toMap(strategy -> strategy.getFileType().toLowerCase(), Function.identity(), (existing, replacing) -> existing));
    }

    public FileUploadStrategy getStrategy(String fileType) {
        if (fileType == null) {
            throw new AppException(ErrorCode.INVALID_FILE_TYPE);
        }
        FileUploadStrategy strategy = strategyMap.get(fileType.toLowerCase());
        if (strategy == null) {
            throw new AppException(ErrorCode.INVALID_FILE_TYPE);
        }
        return strategy;
    }
}
