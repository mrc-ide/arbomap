import { computed } from "vue";
import { storeToRefs } from "pinia";
import * as d3ScaleChromatic from "d3-scale-chromatic";
import Color from "color";
import { FeatureIndicatorValues, FeatureIndicators, IndicatorValue } from "../types/resourceTypes";
import { Dict } from "../types/utilTypes";
import { useAppStore } from "../stores/appStore";

interface IndicatorRange {
    min: number;
    max: number;
    range: number;
}

type FillAndOutlineColor = {
    fillColor: string;
    outlineColor: string;
};

export const useColorScale = (selectedIndicators: ComputedRef<FeatureIndicators>) => {
    // TODO: we currently just scale colours to min and max in data, but
    // we can also provide option to scale to config
    const { appConfig } = storeToRefs(useAppStore());

    const colorScales = computed(() => {
        const result = {};
        if (appConfig.value) {
            const { indicators } = appConfig.value;
            Object.keys(indicators).forEach((key) => {
                const scaleName = indicators[key].colorScale?.name || "interpolateGreens";
                result[key] = d3ScaleChromatic[scaleName];
            });
        }
        return result;
    });

    const indicatorExtremes = computed((): Dict<IndicatorRange> => {
        const result = {};
        const allValues = Object.values(selectedIndicators.value);
        allValues.forEach((featureValues: FeatureIndicatorValues) => {
            Object.entries(featureValues).forEach(([indicator, indicatorValue]) => {
                const value = (indicatorValue as IndicatorValue).mean;
                if (!(indicator in result)) {
                    result[indicator] = { min: value, max: value };
                } else if (value > result[indicator].max) {
                    result[indicator].max = value;
                } else if (value < result[indicator].min) {
                    result[indicator].min = value;
                }
            });
        });
        Object.keys(result).forEach((key) => {
            const indicatorRange = result[key];
            indicatorRange.range =
                indicatorRange.max !== indicatorRange.min // Avoid dividing by zero if only one value...
                    ? indicatorRange.max - indicatorRange.min
                    : 1;
        });
        return result;
    });

    const fadeColor = (fillColor: string, desaturate = 0.5, fade = 0.6) => {
        // for drawing borders more subtly and fading our features, desaturate
        // and fade the color returned from color scale in rgb format
        const c = Color(fillColor);
        return c.desaturate(desaturate).fade(fade).rgb().string();
    };

    const noIndicatorsColor = "transparent";
    const noScalesColor = "rgb(200, 200, 200)";
    const noScalesColorFaded = fadeColor("rgb(200, 200, 200)");

    const getFillAndOutlineColor = (
        indicator: string,
        featureId: string,
        isFaded: boolean = false
    ): FillAndOutlineColor => {
        const featureIndicators = selectedIndicators.value[featureId] as FeatureIndicatorValues | undefined;

        // If indicators do not exist for this feature, return transparent
        if (!featureIndicators || !featureIndicators[indicator]) {
            return {
                fillColor: noIndicatorsColor,
                outlineColor: noIndicatorsColor
            };
        }

        if (!indicatorExtremes.value || !colorScales.value) {
            const baseColor = isFaded ? noScalesColorFaded : noScalesColor;
            return {
                fillColor: baseColor,
                outlineColor: fadeColor(baseColor)
            };
        }

        const value = featureIndicators[indicator].mean;
        const range = indicatorExtremes.value[indicator];

        let colorValue = (value - range.min) / range.range;
        colorValue = Math.min(1, colorValue);
        colorValue = Math.max(0, colorValue);

        const scale = colorScales.value[indicator];

        const reverse = appConfig.value.indicators[indicator].colorScale?.reverse;
        if (reverse) {
            colorValue = 1 - colorValue;
        }

        const color = scale(colorValue);
        const baseColor = isFaded ? fadeColor(color) : color;
        return {
            fillColor: baseColor,
            outlineColor: fadeColor(baseColor)
        };
    };

    return {
        colorScales,
        indicatorExtremes,
        fadeColor,
        getFillAndOutlineColor
    };
};