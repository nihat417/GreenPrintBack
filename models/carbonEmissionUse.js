const mongoose = require("mongoose");

const carbonEmissionSchema = new mongoose.Schema({
  carDistance: {
    type: Number, // В километрах
    required: true,
    default: 0, 
  },
  publicTransport: {
    type: Number, // В километрах
    required: true,
    default: 0, 
  },
  flights: {
    type: Number, // В километрах
    required: true,
    default: 0, 
  },
  electricity: {
    type: Number, // В киловатт-часах
    required: true,
    default: 0, 
  },
  homeHeating: {
    type: Number, // В киловатт-часах
    required: true,
    default: 0, 
  },
  diet: {
    type: String, // "Comprehensive", "Vegetarian", "Vegan"
    required: true,
    default: 0, 
  },
  weeklyTrashGenerated: {
    type: Number, // В килограммах
    required: true,
    default: 0, 
  },
  monthlySpending: {
    type: Number, // В долларах
    required: true,
    default: 0, 
  },
  onlineShop: {
    type: Number, // Количество продуктов
    required: true,
    default: 0, 
  },
  numberOfPeopleInFamily: {
    type: Number,
    required: true,
    default: 0, 
  },
}, { timestamps: true });

// Метод для вычисления углеродных выбросов
carbonEmissionSchema.methods.calculateCarbonEmissions = function() {
  const { carDistance, publicTransport, flights, electricity, homeHeating, diet, weeklyTrashGenerated, onlineShop, numberOfPeopleInFamily } = this;

  // Вычисление выбросов для разных факторов
  let emissions = 0;

  // Автомобиль: 1 км = 0.25 кг CO₂
  emissions += carDistance * 0.25;

  // Общественный транспорт: 1 км = 0.05 кг CO₂
  emissions += publicTransport * 0.05;

  // Полеты: 1 км = 0.15 кг CO₂ (условно для расчетов)
  emissions += flights * 0.15;

  // Электричество: 1 кВтч = 0.5 кг CO₂ (условно для расчетов)
  emissions += electricity * 0.5;

  // Отопление: 1 кВтч = 0.3 кг CO₂ (условно для расчетов)
  emissions += homeHeating * 0.3;

  // Питание:
  if (diet === "Comprehensive") {
    emissions += 2 * 365; // 2 кг CO₂ в день
  } else if (diet === "Vegetarian") {
    emissions += 1.5 * 365; // 1.5 кг CO₂ в день
  } else if (diet === "Vegan") {
    emissions += 1 * 365; // 1 кг CO₂ в день
  }

  // Тариф на мусор: 1 кг мусора = 0.1 кг CO₂
  emissions += weeklyTrashGenerated * 0.1 * 52; // годовой расчет

  // Онлайн покупки: 1 товар = 1 кг CO₂
  emissions += onlineShop;

  // Выбросы на человека в семье (предположительно):
  emissions *= numberOfPeopleInFamily;

  return emissions;
};

const CarbonEmission = mongoose.model("CarbonEmission", carbonEmissionSchema);

module.exports = CarbonEmission;
