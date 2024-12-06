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

document.getElementById('subDistance').addEventListener('click', function() {
    event.preventDefault();
    car.usage = document.getElementById('spotreba').value;
    car.capacity = document.getElementById('kapacita').value;
    document.getElementById('resultDis').innerHTML = `Maximální dojezd auta je ${Math.round(car.calcMaxDistance())} km.`;
});

document.getElementById('subUsege').addEventListener('click', function() {
    event.preventDefault();
    car.maxDistance = document.getElementById('dojezdUse').value;
    car.capacity = document.getElementById('kapacitaUse').value;
    document.getElementById('resultUse').innerHTML = `Spotřeba auta je ${car.calcUsage().toFixed(2)} l na km.`;
});

document.getElementById('subCapacity').addEventListener('click', function() {
    event.preventDefault();
    car.usage = document.getElementById('spotrebaCap').value;
    car.maxDistance = document.getElementById('dojezdCap').value;
    document.getElementById('resultCap').innerHTML = `Kapacita nádrže auta je ${Math.round(car.calcCapacity())} l.`;
});

document.getElementById('subPrice').addEventListener('click', function() {
    event.preventDefault();
    car.usage = document.getElementById('spotrebaPri').value;
    car.priceGas = document.getElementById('cenaPri').value;
    car.distance = document.getElementById('vzdalenostPri').value;
    document.getElementById('resultPrice').innerHTML = `Cena za cestu je ${car.calcPriceRoad().toFixed(2)} Kč.`;
});

document.getElementById('subPTxCar').addEventListener('click', function() {
    event.preventDefault();
    car.pricePT = document.getElementById('cenaDop').value;
    car.priceGas = document.getElementById('cenaGas').value;
    car.distance = document.getElementById('vzdalenostPTxCar').value;
    car.usage = document.getElementById('spotrebaPTxCar').value;
    document.getElementById('resultPTxCar').innerHTML = `${car.calcPTxCar()}`;
});

document.getElementById('subMap').addEventListener('click', function() {
    event.preventDefault();
    car.usage = document.getElementById('spotrebaMap').value;
    car.gasLeft = document.getElementById('kapacitaMap').value;
    car.priceGas = document.getElementById('cenaMap').value;
    document.getElementById('resultMap').innerHTML = `Maximální cena za cestu je ${car.calcPrice().toFixed(2)} Kč.\n Maximální vzdálenost je ${car.calcMapDistance().toFixed(2)} km.`;
});


