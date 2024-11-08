package com.mercure.utils;

import java.util.Random;

public class ColorsUtils {

    private final String[] colorsArray =
            {
                    "#FFC194", "#9CE03F", "#62C555", "#3AD079",
                    "#44CEC3", "#F772EE", "#FFAFD2", "#FFB4AF",
                    "#FF9207", "#E3D530", "#D2FFAF", "FF5733"
            };

    public String getRandomColor() {
        return this.colorsArray[new Random().nextInt(colorsArray.length)];
    }
}
