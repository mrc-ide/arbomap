import { createPinia, setActivePinia } from "pinia";
import { useAppStore } from "../../../src/stores/appStore";
import { useSelectedMapInfo } from "../../../src/composables/useSelectedMapInfo";
import { mockMapSettings } from "../mocks/mockPinia";

describe("useSelectedMapInfo", () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });

    test("selectedFeatures includes all admin 1 features when there is no selected country", async () => {
        const store = useAppStore();
        await store.initialiseData();
        await store.updateMapSettings(mockMapSettings());
        const { selectedFeatures } = useSelectedMapInfo();
        expect(selectedFeatures.value).toStrictEqual([
            { properties: { shapeID: "123", shapeName: "Test123", shapeGroup: "MWI" } },
            { properties: { shapeID: "789", shapeName: "Test789", shapeGroup: "TZA" } }
        ]);
    });

    test("selectedFeatures includes selected country's admin2 features, and admin1 for all others", async () => {
        const store = useAppStore();
        await store.initialiseData();
        await store.updateMapSettings(mockMapSettings({ country: "TZA", adminLevel: 2 }));
        const { selectedFeatures } = useSelectedMapInfo();
        expect(selectedFeatures.value).toStrictEqual([
            { properties: { shapeID: "789-a", shapeName: "Test789-a", shapeGroup: "TZA" } },
            { properties: { shapeID: "789-b", shapeName: "Test789-b", shapeGroup: "TZA" } },
            { properties: { shapeID: "123", shapeName: "Test123", shapeGroup: "MWI" } }
        ]);
    });

    test("selectedFeatures includes selected country's admin1 features if adminLevel is 1", async () => {
        const store = useAppStore();
        await store.initialiseData();
        await store.updateMapSettings(mockMapSettings({ country: "TZA", adminLevel: 1 }));
        const { selectedFeatures } = useSelectedMapInfo();
        expect(selectedFeatures.value).toStrictEqual([
            { properties: { shapeID: "123", shapeName: "Test123", shapeGroup: "MWI" } },
            { properties: { shapeID: "789", shapeName: "Test789", shapeGroup: "TZA" } }
        ]);
    });

    test("selectedIndicators includes all admin 1 features when there is no selected country", async () => {
        const store = useAppStore();
        await store.initialiseData();
        await store.updateMapSettings(mockMapSettings());
        const { selectedIndicators } = useSelectedMapInfo();
        expect(selectedIndicators.value).toStrictEqual({
            "123": {
                FOI: { mean: 0.1, sd: 0.01 },
                serop9: { mean: 0.2, sd: 0.02 },
                hosp_total: { mean: 0.3, sd: 0.03 },
                hosp_0_4: { mean: 0.4, sd: 0.04 },
                hosp_5_9: { mean: 0.5, sd: 0.05 }
            },
            "789": {
                FOI: { mean: 0.3, sd: 0.03 },
                serop9: { mean: 0.4, sd: 0.04 },
                hosp_total: { mean: 0.5, sd: 0.05 },
                hosp_0_4: { mean: 0.6, sd: 0.06 },
                hosp_5_9: { mean: 0.7, sd: 0.07 }
            }
        });
    });

    test("selectedIndicators includes selected country's admin2 indicators, and admin1 for all others", async () => {
        const store = useAppStore();
        await store.initialiseData();
        await store.updateMapSettings(mockMapSettings({ country: "TZA", adminLevel: 2 }));
        const { selectedIndicators } = useSelectedMapInfo();
        expect(selectedIndicators.value).toStrictEqual({
            "123": {
                FOI: { mean: 0.1, sd: 0.01 },
                serop9: { mean: 0.2, sd: 0.02 },
                hosp_total: { mean: 0.3, sd: 0.03 },
                hosp_0_4: { mean: 0.4, sd: 0.04 },
                hosp_5_9: { mean: 0.5, sd: 0.05 }
            },
            "789-a": {
                FOI: { mean: 0.31, sd: 0.031 },
                serop9: { mean: 0.41, sd: 0.041 }
            },
            "789-b": {
                FOI: { mean: 0.32, sd: 0.032 },
                serop9: { mean: 0.42, sd: 0.042 }
            }
        });
    });

    test("selectedIndicators includes selected country's admin1 indicators when adminLevel is 1", async () => {
        const store = useAppStore();
        await store.initialiseData();
        await store.updateMapSettings(mockMapSettings({ country: "TZA", adminLevel: 1 }));
        const { selectedIndicators } = useSelectedMapInfo();
        expect(selectedIndicators.value).toStrictEqual({
            "123": {
                FOI: { mean: 0.1, sd: 0.01 },
                serop9: { mean: 0.2, sd: 0.02 },
                hosp_total: { mean: 0.3, sd: 0.03 },
                hosp_0_4: { mean: 0.4, sd: 0.04 },
                hosp_5_9: { mean: 0.5, sd: 0.05 }
            },
            "789": {
                FOI: { mean: 0.3, sd: 0.03 },
                serop9: { mean: 0.4, sd: 0.04 },
                hosp_total: { mean: 0.5, sd: 0.05 },
                hosp_0_4: { mean: 0.6, sd: 0.06 },
                hosp_5_9: { mean: 0.7, sd: 0.07 }
            }
        });
    });
});
