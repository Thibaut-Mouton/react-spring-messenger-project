package com.mercure.utils;

import com.mercure.dto.user.GroupDTO;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Comparator;

public class ComparatorListGroupDTO implements Comparator<GroupDTO> {

    @Override
    public int compare(GroupDTO group1, GroupDTO group2) {
        if (group1.getLastMessageDate() == null) {
            return -1;
        }
        if (group2.getLastMessageDate() == null) {
            return 1;
        }
        if (group2.getLastMessageDate() == null && group1.getLastMessageDate() == null) {
            return group1.getName().compareTo(group2.getName());
        }
        try {
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");
            if (sdf.parse(group1.getLastMessageDate()).before(sdf.parse(group2.getLastMessageDate()))) {
                return 1;
            } else if (sdf.parse(group1.getLastMessageDate()).after(sdf.parse(group2.getLastMessageDate()))) {
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
