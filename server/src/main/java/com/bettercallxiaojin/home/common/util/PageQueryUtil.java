package com.bettercallxiaojin.home.common.util;

import java.util.Collections;
import java.util.List;

public class PageQueryUtil {

    public static <T> List<T> paginate(List<T> fullList, int pageNum, int pageSize) {
        if (fullList == null || fullList.isEmpty()) {
            return Collections.emptyList();
        }
        if (pageNum < 1) pageNum = 1;
        if (pageSize < 1) pageSize = 10;

        int fromIndex = (pageNum - 1) * pageSize;
        if (fromIndex >= fullList.size()) {
            return Collections.emptyList();
        }

        int toIndex = Math.min(fromIndex + pageSize, fullList.size());
        return fullList.subList(fromIndex, toIndex);
    }

    public static <T> List<T> paginate(List<T> fullList, String pageNumStr, String pageSizeStr) {
        int pageNum;
        int pageSize;
        try {
            pageNum = Integer.parseInt(pageNumStr);
        } catch (NumberFormatException e) {
            pageNum = 1;
        }
        try {
            pageSize = Integer.parseInt(pageSizeStr);
        } catch (NumberFormatException e) {
            pageSize = 10;
        }
        return paginate(fullList, pageNum, pageSize);
    }
}