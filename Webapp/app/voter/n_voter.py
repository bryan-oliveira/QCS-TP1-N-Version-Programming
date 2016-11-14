import threading
import time
from suds.client import Client


def n_voter(type, args):
    ws = ['http://webservice-sqdcourse.rhcloud.com/InsulinDoseCalculator?wsdl',
          'http://qcsa1-beardsdei.rhcloud.com/qcsa1/InsulinDoseCalculator?wsdl',
          'http://qcsproject1-qcsproject.rhcloud.com/InsulinDoseCalculator?wsdl']

    backup = ['http://insulincalculator-aybareon.rhcloud.com/InsulinCalculatorTomcat/InsulinCalculator?wsdl',
              'http://qcsa1-ran1234.rhcloud.com/server/InsulinDoseCalculator?wsdl',
              'http://qcs07.dei.uc.pt:8080/InsulinCalculator?wsdl']

    response = [-1, -1, -1, -1]
    threads = []
    backup_response = False

    for i in range(0, 3):
        if type == 0:
            t = threading.Thread(target=backgroundInsulinDose,
                                 args=(i, ws, args, response))
        elif type == 1:
            t = threading.Thread(
                target=mealtimeInsulinDoseStandard, args=(i, ws, args, response))
        else:
            t = threading.Thread(
                target=mealtimeInsulinDosePersonal, args=(i, ws, args, response))
        # t.setDaemon(True)
        threads.append(t)
        t.start()

    start_time = time.time()

    threads[0].join(4)
    threads[1].join(4)
    threads[2].join(4)

    decider(response)

    if response[3] == -1 and (4 - (time.time() - start_time)) > 0:
        for i in range(0, 3):
            if type == 0:
                t = threading.Thread(target=backgroundInsulinDose,
                                     args=(i, backup, args, response))
            elif type == 1:
                t = threading.Thread(
                    target=mealtimeInsulinDoseStandard, args=(i, backup, args, response))
            else:
                t = threading.Thread(
                    target=mealtimeInsulinDosePersonal, args=(i, backup, args, response))

            threads.append(t)
            t.start()

        threads[3].join(4 - (time.time() - start_time))
        threads[4].join(4 - (time.time() - start_time))
        threads[5].join(4 - (time.time() - start_time))

        decider(response)
        if response[3] != -1:
            backup_response = True

    return dict(response=response,
                ws=ws,
                backup_response=backup_response,
                backup_ws=backup)


def backgroundInsulinDose(index, ws, args, response):
    clear_results(response)
    client = Client(ws[index])
    response[index] = client.service.backgroundInsulinDose(args[0])


def mealtimeInsulinDosePersonal(index, ws, args, response):
    clear_results(response)
    client = Client(ws[index])
    personal_sensitivity = client.service.personalSensitivityToInsulin(args[4], args[
                                                                       5], args[6])
    response[index] = client.service.mealtimeInsulinDose(
        args[0], args[1], args[2], args[3], personal_sensitivity)


def mealtimeInsulinDoseStandard(index, ws, args, response):
    clear_results(response)
    client = Client(ws[index])
    response[index] = client.service.mealtimeInsulinDose(
        args[0], args[1], args[2], args[3], args[4])


def clear_results(response):
    for index, items in enumerate(response):
        response[index] = -1


def decider(response):

    array = response[:3]
    array.sort()

    if array[0] != -1 and ((array[1] <= array[2] - 1) or (array[1] <= array[0] + 1)):
        response[3] = array[1]
