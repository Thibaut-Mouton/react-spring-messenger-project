package com.mercure.utils;

import com.mercure.dto.GroupDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Comparator;

public class ComparatorListGroupDTO implements Comparator<GroupDTO> {

    private Logger log = LoggerFactory.getLogger(ComparatorListGroupDTO.class);

    // return 1 if date2 should be before date1
    // return -1 if date1 should be before date2
    // return 0 otherwise (meaning the order stays the same)
    // result of date1 - date2

    @Override
    public int compare(GroupDTO o1, GroupDTO o2) {
        if (o1.getLastMessageDate() == null) {
            log.debug("o1 is null");
            return -1;
        }
        if (o2.getLastMessageDate() == null) {
            log.debug("o2 is null");
            return 1;
        }
        if (o2.getLastMessageDate() == null && o1.getLastMessageDate() == null) {
            log.debug("both are null, comparing by name");
            return o1.getName().compareTo(o2.getName());
        }
        try {
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");
            if (sdf.parse(o1.getLastMessageDate()).before(sdf.parse(o2.getLastMessageDate()))) {
                return 1;
            } else if (sdf.parse(o1.getLastMessageDate()).after(sdf.parse(o2.getLastMessageDate()))) {
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
