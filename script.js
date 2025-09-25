document.getElementById('cable-sizer-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const voltage = document.getElementById('voltage').value;
    const current = document.getElementById('current').value;
    const distance = document.getElementById('distance').value;
    const conductor = document.getElementById('conductor').value;
    const resultDiv = document.getElementById('cable-sizer-result');

    if (voltage && current && distance) {
        // Constants
        const RHO_COPPER = 1.68e-8; // Resistivity of copper in Ohm-meters
        const RHO_ALUMINUM = 2.65e-8; // Resistivity of aluminum in Ohm-meters
        const VOLTAGE_DROP_PERCENTAGE = 0.03; // 3% voltage drop

        const rho = (conductor === 'copper') ? RHO_COPPER : RHO_ALUMINUM;

        // Calculate required cross-sectional area in m^2
        const area_m2 = (2 * distance * current * rho) / (voltage * VOLTAGE_DROP_PERCENTAGE);

        // Convert area to mm^2
        const area_mm2 = area_m2 * 1e6;

        // Expanded lookup table for AWG and mm^2
        const wireGauges = [
            { awg: "18", mm2: 0.823 },
            { awg: "16", mm2: 1.31 },
            { awg: "14", mm2: 2.08 },
            { awg: "12", mm2: 3.31 },
            { awg: "10", mm2: 5.26 },
            { awg: "8", mm2: 8.37 },
            { awg: "6", mm2: 13.3 },
            { awg: "4", mm2: 21.15 },
            { awg: "2", mm2: 33.6 },
            { awg: "1", mm2: 42.4 },
            { awg: "1/0", mm2: 53.5 },
            { awg: "2/0", mm2: 67.4 },
            { awg: "3/0", mm2: 85.0 },
            { awg: "4/0", mm2: 107.2 }
        ];

        let recommendedGauge = null;
        for (const gauge of wireGauges) {
            if (gauge.mm2 >= area_mm2) {
                recommendedGauge = gauge;
                break;
            }
        }

        if (recommendedGauge) {
            resultDiv.innerHTML = `
                <p>Required cable cross-sectional area: ${area_mm2.toFixed(2)} mm²</p>
                <p>Recommended Cable Size for ${conductor.charAt(0).toUpperCase() + conductor.slice(1)}:</p>
                <p><strong>AWG:</strong> ${recommendedGauge.awg}</p>
                <p><strong>Metric:</strong> ${recommendedGauge.mm2} mm²</p>
            `;
        } else {
            resultDiv.innerHTML = "<p>The required cable size is too large for this calculator. Please consult a professional.</p>";
        }
    } else {
        resultDiv.innerHTML = "<p>Please fill in all fields.</p>";
    }
});