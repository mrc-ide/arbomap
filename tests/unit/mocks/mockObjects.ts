export const MOCK_APP_CONFIG = {
    title: "MockApp",
    countries: ["MWI", "TZA"],
    indicators: {
        "FOI": {
            colourScale: { name: "interpolateReds" }
        },
        "p9": {
            colourScale: { name: "interpolateBlues" }
        }
    }
};

export const MOCK_ADMIN1_GEOJSON = {
    "MWI": {
        features: [
            { properties: { shapeID: "123", shapeName: "Test123", shapeGroup: "MWI" } }
        ]
    },
    "TZA": {
        features: [
            { properties: { shapeID: "789", shapeName: "Test789", shapeGroup: "TZA" } }
        ]
    }
};

export const MOCK_ADMIN2_GEOJSON = {
    "TZA": {
        features: [
            { properties: { shapeID: "789-a", shapeName: "Test789-a", shapeGroup: "TZA" } },
            { properties: { shapeID: "789-b", shapeName: "Test789-b", shapeGroup: "TZA" } }
        ]
    },
    "MWI": {
        features: [
            {properties: {shapeID: "123-a", shapeName: "Test123-a", shapeGroup: "TZA"}},
        ]
    }
}

export const MOCK_ADMIN1_INDICATORS = {
    "MWI": {
        "123": {
            "FOI": { mean: 0.1, sd: 0.01 },
            "p9": { mean: 0.2, sd: 0.02 }
        }
    },
    "TZA": {
        "789": {
            "FOI": { mean: 0.3, sd: 0.03 },
            "p9": { mean: 0.4, sd: 0.04 }
        }
    }

};

export const MOCK_ADMIN2_INDICATORS = {
    "TZA": {
        "789-a": {
            "FOI": { mean: 0.31, sd: 0.031 },
            "p9": { mean: 0.41, sd: 0.041 }
        },
        "789-b": {
            "FOI": { mean: 0.32, sd: 0.032 },
            "p9": { mean: 0.42, sd: 0.042 }
        }
    },
    "MWI": {
        "123-a": {
            "FOI": { mean: 0.1, sd: 0.01 },
            "p9": { mean: 0.2, sd: 0.02 }
        }
    },
};



