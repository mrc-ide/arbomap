import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";
import { mockPinia } from "../mocks/mockPinia";
import Legend from "../../../src/components/Legend.vue";
import { MOCK_APP_CONFIG } from "../mocks/mockObjects";

const appConfig = {
    ...MOCK_APP_CONFIG,
    indicators: {
        indicatorThatHasSmallNumbers: {
            colourScale: { name: "interpolateReds" },
            humanReadableName: "Widgets per 100,000 capita",
            unit: "widgets"
        },
        indicatorMeasuredInPercent: {
            colourScale: { name: "interpolateBlues" },
            humanReadableName: "Comorbidity with diabetes",
            unit: "%"
        }
    }
};
const admin1Indicators = {
    TZA: {
        Region1: {
            indicatorThatHasSmallNumbers: { mean: 0.0005123456789, sd: 1 },
            indicatorMeasuredInPercent: { mean: 0.1123456789, sd: 1 }
        },
        Region2: {
            indicatorThatHasSmallNumbers: { mean: 0.0002123456789, sd: 1 },
            indicatorMeasuredInPercent: { mean: 0.3123456789, sd: 1 }
        }
    }
};
const admin2Indicators = {
    TZA: {
        "Region1-a": {
            indicatorThatHasSmallNumbers: { mean: 0.0003123456789, sd: 1 },
            indicatorMeasuredInPercent: { mean: 0.4123456789, sd: 1 }
        },
        "Region1-b": {
            indicatorThatHasSmallNumbers: { mean: 0.0003223456789, sd: 1 },
            indicatorMeasuredInPercent: { mean: 0.4223456789, sd: 1 }
        },
        "Region2-a": {
            indicatorThatHasSmallNumbers: { mean: 0.0003987654321, sd: 1 },
            indicatorMeasuredInPercent: { mean: 0.4123456789, sd: 1 }
        },
        "Region2-b": {
            indicatorThatHasSmallNumbers: { mean: 0.0003, sd: 1 },
            indicatorMeasuredInPercent: { mean: 0.4223456789, sd: 1 }
        }
    }
};

const defaultNumberOfSteps = 6;

let store;
const renderComponent = () => {
    return render(Legend, {
        global: {
            plugins: [store]
        }
    });
};

describe("Legend", () => {
    describe("when a number of steps is specified", () => {
        test("renders the specified no. of steps", () => {
            const numberOfSteps = 10;
            render(Legend, { global: { plugins: [mockPinia()] }, props: { numberOfSteps } });
            const legendItems = screen.getAllByTestId("legendItem");
            expect(legendItems).toHaveLength(numberOfSteps);
        });
    });

    describe("when a country has been selected", () => {
        const selectedCountryId = "TZA";

        describe("when the selected indicator is indicatorThatHasSmallNumbers", () => {
            beforeAll(() => {
                store = mockPinia({
                    admin1Indicators,
                    admin2Indicators,
                    appConfig,
                    selectedCountryId,
                    selectedIndicator: "indicatorThatHasSmallNumbers"
                });
            });

            test("renders default no. of steps, and rounds numbers to a sensible precision", async () => {
                renderComponent();
                const legendItems = screen.getAllByTestId("legendItem");
                expect(legendItems).toHaveLength(defaultNumberOfSteps);
                const displayedValues = legendItems.map((item) => parseFloat(item.textContent));
                // Ensure displayed values are in descending order
                expect(displayedValues).toEqual(displayedValues.sort().reverse());
                expect(displayedValues[0]).toEqual(0.0004);
                expect(displayedValues[1]).toEqual(0.00038);
                expect(displayedValues[2]).toEqual(0.00036);
                expect(displayedValues[3]).toEqual(0.00034);
                expect(displayedValues[4]).toEqual(0.00032);
                expect(displayedValues[5]).toEqual(0.0003);
                // Test units are displayed
                expect(legendItems[0].textContent).toEqual("0.0004 widgets");
            });
        });

        describe("when the selected indicator is indicatorMeasuredInPercent", () => {
            beforeAll(() => {
                store = mockPinia({
                    admin1Indicators,
                    admin2Indicators,
                    appConfig,
                    selectedCountryId,
                    selectedIndicator: "indicatorMeasuredInPercent"
                });
            });

            test("renders default no. of steps, and rounds numbers to a sensible precision", async () => {
                renderComponent();
                const legendItems = screen.getAllByTestId("legendItem");
                expect(legendItems).toHaveLength(defaultNumberOfSteps);
                const displayedValues = legendItems.map((item) => parseFloat(item.textContent));
                // Ensure displayed values are in descending order
                expect(displayedValues).toEqual(displayedValues.sort().reverse());
                expect(displayedValues[0]).toEqual(0.422);
                expect(displayedValues[1]).toEqual(0.42);
                expect(displayedValues[2]).toEqual(0.418);
                expect(displayedValues[3]).toEqual(0.416);
                expect(displayedValues[4]).toEqual(0.414);
                expect(displayedValues[5]).toEqual(0.412);
                // Test units are displayed
                expect(legendItems[0].textContent).toEqual("0.422%");
            });
        });
    });

    describe("when a country has not been selected", () => {
        const selectedCountryId = null;

        describe("when the selected indicator is indicatorThatHasSmallNumbers", () => {
            beforeAll(() => {
                store = mockPinia({
                    admin1Indicators,
                    admin2Indicators,
                    appConfig,
                    selectedCountryId,
                    selectedIndicator: "indicatorThatHasSmallNumbers"
                });
            });

            test("renders default no. of steps, and rounds numbers to a sensible precision", async () => {
                renderComponent();
                const legendItems = screen.getAllByTestId("legendItem");
                expect(legendItems).toHaveLength(defaultNumberOfSteps);
                const displayedValues = legendItems.map((item) => parseFloat(item.textContent));
                // Ensure displayed values are in descending order
                expect(displayedValues).toEqual(displayedValues.sort().reverse());
                expect(displayedValues[0]).toEqual(0.00051);
                expect(displayedValues[1]).toEqual(0.00045);
                expect(displayedValues[2]).toEqual(0.00039);
                expect(displayedValues[3]).toEqual(0.00033);
                expect(displayedValues[4]).toEqual(0.00027);
                expect(displayedValues[5]).toEqual(0.00021);
                // Test units are displayed
                expect(legendItems[0].textContent).toEqual("0.00051 widgets");
            });
        });

        describe("when the selected indicator is indicatorMeasuredInPercent", () => {
            beforeAll(() => {
                store = mockPinia({
                    admin1Indicators,
                    admin2Indicators,
                    appConfig,
                    selectedCountryId,
                    selectedIndicator: "indicatorMeasuredInPercent"
                });
            });

            test("renders default no. of steps, and rounds numbers to a sensible precision", async () => {
                renderComponent();
                const legendItems = screen.getAllByTestId("legendItem");
                expect(legendItems).toHaveLength(defaultNumberOfSteps);
                const displayedValues = legendItems.map((item) => parseFloat(item.textContent));
                // Ensure displayed values are in descending order
                expect(displayedValues).toEqual(displayedValues.sort().reverse());
                expect(displayedValues[0]).toEqual(0.31);
                expect(displayedValues[1]).toEqual(0.27);
                expect(displayedValues[2]).toEqual(0.23);
                expect(displayedValues[3]).toEqual(0.19);
                expect(displayedValues[4]).toEqual(0.15);
                expect(displayedValues[5]).toEqual(0.11);
                // Test units are displayed
                expect(legendItems[0].textContent).toEqual("0.31%");
            });
        });
    });
});