let car = {
    usage: 0,
    capacity: 0,
    gasLeft: 0,
    maxDistance: 0,
    distance: 0,
    priceGas: 0,
    pricePT: 0,

    calcMaxDistance: function() {
        if (this.usage > 0) {
            this.maxDistance = (this.capacity / this.usage) * 100;
        } else {
            this.maxDistance = 0;
        }
        return this.maxDistance;
    },

    calcUsage: function() {
        return (this.capacity / this.maxDistance) * 100;
    },

    calcCapacity: function() {
        return (this.usage * this.maxDistance) / 100;
    },

    calcPriceRoad: function() {
        return (this.distance / 100) * this.usage * this.priceGas;
    },

    calcPTxCar: function() {
        let priceCar = (this.distance / 100) * this.usage * this.priceGas;
        let priceDiff = Math.abs(priceCar - this.pricePT);
        if (priceCar < this.pricePT) {
            return `Auto je levnější než MHD o ${priceDiff.toFixed(2)} Kč. Za cestu autem zaplatíte ${priceCar.toFixed(2)} Kč.`;
        } else {
            return `MHD je levnější než auto o ${priceDiff.toFixed(2)} Kč. Za cestu MHD zaplatíte ${this.pricePT} Kč.`;    
        }
    },

    calcPrice: function() {
        return this.gasLeft * this.priceGas
    },

    calcMapDistance: function() {
        return (this.gasLeft / this.usage) *100;
    }
};

function validateInput(value) {
    let num = parseFloat(value);
    return !isNaN(num) && num > 0 && num <= 2000;
}

document.getElementById('subDistance').addEventListener('click', function(event) {
    event.preventDefault();
    let usage = document.getElementById('spotreba').value;
    let capacity = document.getElementById('kapacita').value;
    if (validateInput(usage) && validateInput(capacity)) {
        car.usage = usage;
        car.capacity = capacity;
        document.getElementById('resultDis').classList = 'result mt-3';
        document.getElementById('resultDis').innerHTML = `Maximální dojezd auta je ${Math.round(car.calcMaxDistance())} km.`;
    } else {
        document.getElementById('resultDis').classList = 'alert alert-danger mt-3';
        document.getElementById('resultDis').innerHTML = `Please enter valid positive numbers.`;
    }
}); 

document.getElementById('subUsege').addEventListener('click', function(event) {
    event.preventDefault();
    let maxDistance = document.getElementById('dojezdUse').value;
    let capacity = document.getElementById('kapacitaUse').value;
    if (validateInput(maxDistance) && validateInput(capacity)) {
        car.maxDistance = maxDistance;
        car.capacity = capacity;
        document.getElementById('resultUse').classList = 'result mt-3';
        document.getElementById('resultUse').innerHTML = `Spotřeba auta je ${car.calcUsage().toFixed(2)} l na km.`;
    } else {
        document.getElementById('resultUse').classList = 'alert alert-danger mt-3';
        document.getElementById('resultUse').innerHTML = `Please enter valid positive numbers.`;
    }
});

document.getElementById('subCapacity').addEventListener('click', function(event) {
    event.preventDefault();
    let usage = document.getElementById('spotrebaCap').value;
    let maxDistance = document.getElementById('dojezdCap').value;
    if (validateInput(usage) && validateInput(maxDistance)) {
        car.usage = usage;
        car.maxDistance = maxDistance;
        document.getElementById('resultCap').classList = 'result mt-3';
        document.getElementById('resultCap').innerHTML = `Kapacita nádrže auta je ${Math.round(car.calcCapacity())} l.`;
    } else {
        document.getElementById('resultCap').classList = 'alert alert-danger mt-3';
        document.getElementById('resultCap').innerHTML = `Please enter valid positive numbers.`;
    }
});

document.getElementById('subPrice').addEventListener('click', function(event) {
    event.preventDefault();
    let usage = document.getElementById('spotrebaPri').value;
    let priceGas = document.getElementById('cenaPri').value;
    let distance = document.getElementById('vzdalenostPri').value;
    if (validateInput(usage) && validateInput(priceGas) && validateInput(distance)) {
        car.usage = usage;
        car.priceGas = priceGas;
        car.distance = distance;
        document.getElementById('resultPrice').classList = 'result mt-3';
        document.getElementById('resultPrice').innerHTML = `Cena za cestu je ${car.calcPriceRoad().toFixed(2)} Kč.`;
    } else {
        document.getElementById('resultPrice').classList = 'alert alert-danger mt-3';
        document.getElementById('resultPrice').innerHTML = `Please enter valid positive numbers.`;
    }
});

document.getElementById('subPTxCar').addEventListener('click', function(event) {
    event.preventDefault();
    let pricePT = document.getElementById('cenaDop').value;
    let priceGas = document.getElementById('cenaGas').value;
    let distance = document.getElementById('vzdalenostPTxCar').value;
    let usage = document.getElementById('spotrebaPTxCar').value;
    if (validateInput(pricePT) && validateInput(priceGas) && validateInput(distance) && validateInput(usage)) {
        car.pricePT = pricePT;
        car.priceGas = priceGas;
        car.distance = distance;
        car.usage = usage;
        document.getElementById('resultPTxCar').classList = 'result mt-3';
        document.getElementById('resultPTxCar').innerHTML = `${car.calcPTxCar()}`;
    } else {
        document.getElementById('resultPTxCar').classList = 'alert alert-danger mt-3';
        document.getElementById('resultPTxCar').innerHTML = `Please enter valid positive numbers.`;
    }
});

document.getElementById('subMap').addEventListener('click', function(event) {
    event.preventDefault();
    let usage = document.getElementById('spotrebaMap').value;
    let gasLeft = document.getElementById('kapacitaMap').value;
    let priceGas = document.getElementById('cenaMap').value;
    if (validateInput(usage) && validateInput(gasLeft) && validateInput(priceGas)) {
        car.usage = usage;
        car.gasLeft = gasLeft;
        car.priceGas = priceGas;
        document.getElementById('resultMap').classList = 'result mt-3';
        document.getElementById('resultMap').innerHTML = `Maximální cena za cestu je ${car.calcPrice().toFixed(2)} Kč.\n Maximální vzdálenost je ${car.calcMapDistance().toFixed(2)} km.`;
    } else {
        document.getElementById('resultMap').classList = 'alert alert-danger mt-3';
        document.getElementById('resultMap').innerHTML = `Please enter valid positive numbers.`;
    }
});
