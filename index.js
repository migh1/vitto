const response = ({ A, B, C, D, E, F, G }) =>
  `Notas entregues: ${A || '0'} notas de R$200,00, ${
    B || '0'
  } notas de R$100,00, ${C || '0'} notas de R$50,00, ${
    D || '0'
  } notas de R$20,00, ${E || '0'} notas de R$10,00, ${
    F || '0'
  } notas de R$5,00 e ${G || '0'} notas de R$2,00`;

const invalid_schedule_digits = [1, 3];

const recursive = (value, res) => {
  if (value >= 200) {
    return recursive(value % 200, { ...res, A: Math.floor(value / 200) });
  }
  if (value >= 100) {
    return recursive(value % 100, { ...res, B: Math.floor(value / 100) });
  }
  if (value >= 50) {
    return recursive(value % 50, { ...res, C: Math.floor(value / 50) });
  }
  if (value >= 20) {
    return recursive(value % 20, { ...res, D: Math.floor(value / 20) });
  }
  if (value >= 10) {
    return recursive(value % 10, { ...res, E: Math.floor(value / 10) });
  }
  if (value >= 5 && value !== 6 && value !== 8) {
    return recursive(value % 5, { ...res, F: Math.floor(value / 5) });
  }
  if (value >= 2) {
    return recursive(value % 2, { ...res, G: Math.floor(value / 2) });
  }
  return res;
};

const get_schedules = value => {
  if (!Number.isInteger(value) || value < 1 || value > 1000) {
    return response({});
  }

  const last_digit = String(value).split('').pop();
  if (invalid_schedule_digits.includes(Number(last_digit))) {
    return response({});
  }

  const res = recursive(value, {});
  return response(res);
};

const log = (value, actual, expected) =>
  console.assert(
    actual === expected,
    `
  VALUE: ${value}
  Actual:
  ${actual}
  Expected:
  ${expected}
  ---------`
  );

// Testes com entrada inválida
const invalid_values = [-1, 0, 1001, 34.2, '12', undefined, null, Infinity];

invalid_values.forEach(v => {
  const expected = response({});
  const actual = get_schedules(v);
  log(v, actual, expected);
});

// Testes com entrada válida mas sem combinação possível de notas
const invalid_schedules = [3, 13, 21, 31, 343, 781];

invalid_schedules.forEach(v => {
  const expected = response({});
  const actual = get_schedules(v);
  log(v, actual, expected);
});

// Testes com entrada válida e combinação possível de notas
log(2, get_schedules(2), response({ G: 1 }));
log(14, get_schedules(14), response({ E: 1, G: 2 }));
log(135, get_schedules(135), response({ B: 1, D: 1, E: 1, F: 1 }));
log(366, get_schedules(366), response({ A: 1, B: 1, C: 1, E: 1, G: 3 }));
log(
  387,
  get_schedules(387),
  response({ A: 1, B: 1, C: 1, D: 1, E: 1, F: 1, G: 1 })
);
log(578, get_schedules(578), response({ A: 2, B: 1, C: 1, D: 1, G: 4 }));
log(826, get_schedules(826), response({ A: 4, D: 1, G: 3 }));
log(998, get_schedules(998), response({ A: 4, B: 1, C: 1, D: 2, G: 4 }));
log(1000, get_schedules(1000), response({ A: 5 }));
