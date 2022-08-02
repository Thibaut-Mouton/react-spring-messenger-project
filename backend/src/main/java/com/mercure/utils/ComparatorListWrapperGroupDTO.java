package com.mercure.utils;

import com.mercure.dto.user.GroupWrapperDTO;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Comparator;

public class ComparatorListWrapperGroupDTO implements Comparator<GroupWrapperDTO> {

    @Override
    public int compare(GroupWrapperDTO group1, GroupWrapperDTO group2) {
        if (group1.getGroup().getLastMessageDate() == null) {
            return -1;
        }
        if (group2.getGroup().getLastMessageDate() == null) {
            return 1;
        }
        if (group2.getGroup().getLastMessageDate() == null && group1.getGroup().getLastMessageDate() == null) {
            return group1.getGroup().getName().compareTo(group2.getGroup().getName());
        }
        try {
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");
            if (sdf.parse(group1.getGroup().getLastMessageDate()).before(sdf.parse(group2.getGroup().getLastMessageDate()))) {
                return 1;
            } else if (sdf.parse(group1.getGroup().getLastMessageDate()).after(sdf.parse(group2.getGroup().getLastMessageDate()))) {
                return -1;
            } else {
                return 0;
            }
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return 0;
    }
}
