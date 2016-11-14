package server;

import javax.jws.WebService;

@WebService(endpointInterface = "server.InsulinDoseCalculator", serviceName = "InsulinDoseCalculatorService", portName = "InsulinDoseCalculatorPort")
public class InsulinDoseCalculatorImpl implements InsulinDoseCalculator {

    public int mealtimeInsulinDose(int carbohydrateAmount, int carbohydrateToInsulinRatio, int preMealBloodSugar, int targetBloodSugar, int personalSensitivity) {
        double highBloodSugarDose = (preMealBloodSugar - targetBloodSugar) / personalSensitivity;
        double carbohydrateDose = carbohydrateAmount / carbohydrateToInsulinRatio / personalSensitivity * 50;

        return (int) (highBloodSugarDose + carbohydrateDose);
    }

    public int backgroundInsulinDose(int bodyWeight) {
        double backgroundInsulinDose = 0.55 * bodyWeight;
        return (int) (backgroundInsulinDose * 0.5);
    }

    public int personalSensitivityToInsulin(int physicalActivityLevel, int[] physicalActivitySamples, int[] bloodSugarDropSamples) {
        int num = physicalActivitySamples.length;

        double sumx = 0.0, sumy = 0.0;
        for (int i = 0; i < num; i++) {
            sumx += physicalActivitySamples[i];
            sumy += bloodSugarDropSamples[i];
        }
        double xbar = sumx / num;
        double ybar = sumy / num;

        double xxbar = 0.0, xybar = 0.0;
        for (int i = 0; i < num; i++) {
            xxbar += (physicalActivitySamples[i] - xbar) * (physicalActivitySamples[i] - xbar);
            xybar += (physicalActivitySamples[i] - xbar) * (bloodSugarDropSamples[i] - ybar);
        }
        double beta = xybar / xxbar;
        double alpha = ybar - beta * xbar;

        return (int) (alpha + beta + physicalActivityLevel);
    }
}
