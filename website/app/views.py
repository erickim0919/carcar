from flask import Blueprint, Flask, jsonify, request
from .models import Car
import time

flask_app = Flask(__name__)
cars_blueprint = Blueprint(
    'cars', __name__,
    template_folder="templates"
)


@cars_blueprint.route('/dump', methods=["POST"])
def serve():
    req_data = request.get_json()
    cars = Car.query
    if req_data["Price"]:
        cars = cars.filter(Car.MSRP <= req_data["Price"][1])\
            .filter(Car.MSRP >= req_data["Price"][0])
    if req_data["Type"]:
        cars = cars.filter_by(type=req_data["Type"])
    if req_data["Seats"]:
        cars = cars.filter(Car.seats.between(
            req_data["Seats"][0], req_data["Seats"][1]))
    carList = [car.serialize() for car in cars]
    return jsonify(carList)


@cars_blueprint.route('/dump_sorted', methods=["POST"])
def dump_sorted():
    req_data = request.get_json()
    cars = Car.query
    sort = False
    big_cars = []
    if req_data["Price"]:
        sort = True
        for price in req_data["Price"]:
            mini_cars = cars.filter(Car.MSRP <= price[1])\
                    .filter(Car.MSRP >= price[0])
            big_cars.append(mini_cars)

    if req_data["Type"]:
        sort = True
        if len(big_cars) == 0:
            for car_type in req_data["Type"]:
                mini_cars = cars.filter_by(type=car_type)
                big_cars.append(mini_cars)
        else:
            poses = []
            for i in range(len(big_cars)):
                for car_type in req_data["Type"]:
                    pos = big_cars[i].filter_by(type=car_type)
                    poses.append(pos)
            big_cars = poses.copy()

    if req_data["Seats"]:
        sort = True
        if len(big_cars) == 0:
            for seat in req_data["Seats"]:
                mini_cars = cars.filter(Car.seats.between(
                    seat[0], seat[1]))
                big_cars.append(mini_cars)
        else:
            poses = []
            for i in range(len(big_cars)):
                for seat in req_data["Seats"]:
                    pos = big_cars[i].filter(Car.seats.between(seat[0], seat[1]))
                    poses.append(pos)
            big_cars = poses.copy()
    if sort:
        final_list = []
        for car in big_cars:
            for k in car.all():
                if k not in final_list:
                    final_list.append(k)
        if req_data["sort_by"] == "MSRP":
            cars = sorted([car.serialize() for car in final_list],
                        key=lambda x: x[req_data["sort_by"]])
        else:
            cars = sorted([car.serialize() for car in final_list],
                        key=lambda x: x[req_data["sort_by"]], reverse=True)
    else:
        cars = sorted([car.serialize() for car in cars.all()],
                    key=lambda x: x[req_data["sort_by"]], reverse=True)
            
    return jsonify(split(cars, 3))


@cars_blueprint.route('/dump_by', methods=["POST"])
def dump_rating():
    req_data = request.get_json()
    cars = Car.query
    big_cars = []
    sort = False
    if req_data["Price"]:
        sort = True
        for price in req_data["Price"]:
            mini_cars = cars.filter(Car.MSRP <= price[1])\
                    .filter(Car.MSRP >= price[0])
            big_cars.append(mini_cars)
 
    if req_data["Type"]:
        sort = True
        if len(big_cars) == 0:
            for car_type in req_data["Type"]:
                mini_cars = cars.filter_by(type=car_type)
                big_cars.append(mini_cars)
        else:
            poses = []
            for i in range(len(big_cars)):
                for car_type in req_data["Type"]:
                    pos = big_cars[i].filter_by(type=car_type)
                    poses.append(pos)
            big_cars = poses.copy()

    if req_data["Seats"]:
        sort = True
        if len(big_cars) == 0:
            for seat in req_data["Seats"]:
                mini_cars = cars.filter(Car.seats.between(
                    seat[0], seat[1]))
                big_cars.append(mini_cars)
        else:
            poses = []
            for i in range(len(big_cars)):
                for seat in req_data["Seats"]:
                    pos = big_cars[i].filter(Car.seats.between(seat[0], seat[1]))
                    poses.append(pos)
            big_cars = poses.copy()
    if sort:
        final_list = []
        for car in big_cars:
            for k in car.all():
                if k not in final_list:
                    final_list.append(k)
        cars = sorted([car.serialize() for car in final_list],
                      key=lambda x: x[req_data["sort_by"]], reverse=True)
    else:
        cars = sorted([car.serialize() for car in cars.all()],
                      key=lambda x: x[req_data["sort_by"]], reverse=True)

    return jsonify(cars)


def split(a, n):
    return [a[i * len(a) // n: i * len(a) // n + len(a) // n] for i in range(n)]


@cars_blueprint.route('/available', methods=["POST"])
def get_available():
    req_data = request.get_json()
    cars = Car.query
    if req_data["Price"]:
        cars = cars.filter(Car.MSRP <= req_data["Price"][1])\
            .filter(Car.MSRP >= req_data["Price"][0])
    if req_data["Type"]:
        cars = cars.filter_by(type=req_data["Type"])
    if req_data["Seats"]:
        cars = cars.filter(Car.seats.between(
            req_data["Seats"][0], req_data["Seats"][1]))
    booleanList = []
    for i in req_data["futureRound"]:
        if i[0] == "Type":
            if (cars.filter_by(type=i[2]).count() > 0):
                booleanList.append(True)
            else:
                booleanList.append(False)
        elif i[0] == "Price":
            if (cars.filter(Car.MSRP <= i[2][1])
                    .filter(Car.MSRP >= i[2][0]).count() > 0):
                booleanList.append(True)
            else:
                booleanList.append(False)
        elif i[0] == "Seats":
            if (cars.filter(Car.seats.between(i[2][0], i[2][1])).count() > 0):
                booleanList.append(True)
            else:
                booleanList.append(False)

    return jsonify(booleanList)
