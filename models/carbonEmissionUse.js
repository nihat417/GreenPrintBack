const mongoose = require("mongoose");

const carbonEmissionSchema = new mongoose.Schema({
  carDistance: {
    type: Number, // В километрах
    default: 0,  // Устанавливаем значение по умолчанию
  },
  publicTransport: {
    type: Number, // В километрах
    default: 0,  // Устанавливаем значение по умолчанию
  },
  flights: {
    type: Number, // В километрах
    default: 0,  // Устанавливаем значение по умолчанию
  },
  electricity: {
    type: Number, // В киловатт-часах
    default: 0,  // Устанавливаем значение по умолчанию
  },
  homeHeating: {
    type: Number, // В киловатт-часах
    default: 0,  // Устанавливаем значение по умолчанию
  },
  diet: {
    type: String, // "Comprehensive", "Vegetarian", "Vegan"
    default: "Comprehensive",  // Устанавливаем значение по умолчанию
  },
  weeklyTrashGenerated: {
    type: Number, // В килограммах
    default: 0,  // Устанавливаем значение по умолчанию
  },
  monthlySpending: {
    type: Number, // В долларах
    default: 0,  // Устанавливаем значение по умолчанию
  },
  onlineShop: {
    type: Number, // Количество продуктов
    default: 0,  // Устанавливаем значение по умолчанию
  },
  numberOfPeopleInFamily: {
    type: Number,
    default: 1,  // Устанавливаем значение по умолчанию
  },
  result: {
    type: Number, // Результат вычисления углеродных выбросов
    required: true,  // Оставляем обязательным, так как это итоговое значение
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
