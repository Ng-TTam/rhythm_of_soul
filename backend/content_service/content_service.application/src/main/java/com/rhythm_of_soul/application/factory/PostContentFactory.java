package com.rhythm_of_soul.application.factory;

import com.rhythm_of_soul.application.factory.strategy.PostContentStrategy;
import com.rhythm_of_soul.domain.model.enums.Type;
import com.rhythm_of_soul.domain.model.exception.AppException;
import com.rhythm_of_soul.domain.model.exception.ErrorCode;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Component
public class PostContentFactory {
    private final Map<Type, PostContentStrategy> strategyMap;

    public PostContentFactory(List<PostContentStrategy> strategies) {
        this.strategyMap = strategies.stream()
                .collect(Collectors.toMap(PostContentStrategy::getType, Function.identity(), (existing, replacing) -> existing));
    }

    public PostContentStrategy getStrategy(Type type) {
        if (type == null) {
            throw new AppException(ErrorCode.INVALID_POST_TYPE);
        }
        PostContentStrategy strategy = strategyMap.get(type);
        if (strategy == null) {
            throw new AppException(ErrorCode.INVALID_POST_TYPE);
        }
        return strategy;
    }
}
