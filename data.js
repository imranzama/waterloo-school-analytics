/**
 * Waterloo Region EQAO Performance Database (2022-2025)
 * Structured dataset including school metadata, geographical coordinates,
 * and multi-year EQAO student performance indicators.
 */

const BENCHMARKS = {
  "Ontario Provincial Average": {
    "2022-2023": {
      "Grade 3 Reading": 73,
      "Grade 3 Writing": 65,
      "Grade 3 Mathematics": 60,
      "Grade 6 Reading": 84,
      "Grade 6 Writing": 82,
      "Grade 6 Mathematics": 50,
      "Grade 9 Mathematics": 54,
      "OSSLT": 85
    },
    "2023-2024": {
      "Grade 3 Reading": 71,
      "Grade 3 Writing": 64,
      "Grade 3 Mathematics": 61,
      "Grade 6 Reading": 82,
      "Grade 6 Writing": 80,
      "Grade 6 Mathematics": 50,
      "Grade 9 Mathematics": 54,
      "OSSLT": 85
    },
    "2024-2025": {
      "Grade 3 Reading": 73,
      "Grade 3 Writing": 66,
      "Grade 3 Mathematics": 63,
      "Grade 6 Reading": 84,
      "Grade 6 Writing": 82,
      "Grade 6 Mathematics": 52,
      "Grade 9 Mathematics": 57,
      "OSSLT": 85
    }
  },
  "WRDSB Average": {
    "2022-2023": {
      "Grade 3 Reading": 69,
      "Grade 3 Writing": 61,
      "Grade 3 Mathematics": 57,
      "Grade 6 Reading": 83,
      "Grade 6 Writing": 82,
      "Grade 6 Mathematics": 51,
      "Grade 9 Mathematics": 52,
      "OSSLT": 84
    },
    "2023-2024": {
      "Grade 3 Reading": 68,
      "Grade 3 Writing": 60,
      "Grade 3 Mathematics": 58,
      "Grade 6 Reading": 82,
      "Grade 6 Writing": 81,
      "Grade 6 Mathematics": 52,
      "Grade 9 Mathematics": 52,
      "OSSLT": 85
    },
    "2024-2025": {
      "Grade 3 Reading": 72,
      "Grade 3 Writing": 62,
      "Grade 3 Mathematics": 62,
      "Grade 6 Reading": 85,
      "Grade 6 Writing": 85,
      "Grade 6 Mathematics": 52,
      "Grade 9 Mathematics": 62,
      "OSSLT": 85
    }
  },
  "WCDSB Average": {
    "2022-2023": {
      "Grade 3 Reading": 74,
      "Grade 3 Writing": 66,
      "Grade 3 Mathematics": 62,
      "Grade 6 Reading": 85,
      "Grade 6 Writing": 83,
      "Grade 6 Mathematics": 53,
      "Grade 9 Mathematics": 55,
      "OSSLT": 86
    },
    "2023-2024": {
      "Grade 3 Reading": 73,
      "Grade 3 Writing": 65,
      "Grade 3 Mathematics": 63,
      "Grade 6 Reading": 84,
      "Grade 6 Writing": 82,
      "Grade 6 Mathematics": 52,
      "Grade 9 Mathematics": 56,
      "OSSLT": 86
    },
    "2024-2025": {
      "Grade 3 Reading": 75,
      "Grade 3 Writing": 67,
      "Grade 3 Mathematics": 65,
      "Grade 6 Reading": 86,
      "Grade 6 Writing": 84,
      "Grade 6 Mathematics": 54,
      "Grade 9 Mathematics": 59,
      "OSSLT": 86
    }
  }
};

const SCHOOLS_DATA = [
  // ==================== SECONDARY SCHOOLS (WRDSB) ====================
  {
    name: "Laurel Heights Secondary School",
    board: "WRDSB",
    level: "Secondary",
    coordinates: [43.4612, -80.5638],
    address: "650 Laurelwood Dr, Waterloo, ON N2V 2V1",
    enrollment: 1650,
    eqao: {
      "2022-2023": {
        "Grade 9 Mathematics": 68,
        "OSSLT": 91
      },
      "2023-2024": {
        "Grade 9 Mathematics": 70,
        "OSSLT": 90
      },
      "2024-2025": {
        "Grade 9 Mathematics": 78,
        "OSSLT": 92
      }
    }
  },
  {
    name: "Waterloo Collegiate Institute",
    board: "WRDSB",
    level: "Secondary",
    coordinates: [43.4770, -80.5284],
    address: "300 Hazel St, Waterloo, ON N2L 3P7",
    enrollment: 1320,
    eqao: {
      "2022-2023": {
        "Grade 9 Mathematics": 66,
        "OSSLT": 89
      },
      "2023-2024": {
        "Grade 9 Mathematics": 67,
        "OSSLT": 88
      },
      "2024-2025": {
        "Grade 9 Mathematics": 75,
        "OSSLT": 90
      }
    }
  },
  {
    name: "Bluevale Collegiate Institute",
    board: "WRDSB",
    level: "Secondary",
    coordinates: [43.4839, -80.5058],
    address: "80 Bluevale St N, Waterloo, ON N2J 3R5",
    enrollment: 1220,
    eqao: {
      "2022-2023": {
        "Grade 9 Mathematics": 62,
        "OSSLT": 86
      },
      "2023-2024": {
        "Grade 9 Mathematics": 64,
        "OSSLT": 87
      },
      "2024-2025": {
        "Grade 9 Mathematics": 72,
        "OSSLT": 88
      }
    }
  },
  {
    name: "Kitchener-Waterloo Collegiate & VS",
    board: "WRDSB",
    level: "Secondary",
    coordinates: [43.4563, -80.5064],
    address: "787 King St W, Kitchener, ON N2G 1E3",
    enrollment: 1400,
    eqao: {
      "2022-2023": {
        "Grade 9 Mathematics": 58,
        "OSSLT": 84
      },
      "2023-2024": {
        "Grade 9 Mathematics": 59,
        "OSSLT": 85
      },
      "2024-2025": {
        "Grade 9 Mathematics": 66,
        "OSSLT": 86
      }
    }
  },
  {
    name: "Cameron Heights Collegiate Institute",
    board: "WRDSB",
    level: "Secondary",
    coordinates: [43.4431, -80.4851],
    address: "301 Charles St E, Kitchener, ON N2G 2P8",
    enrollment: 1750,
    eqao: {
      "2022-2023": {
        "Grade 9 Mathematics": 60,
        "OSSLT": 82
      },
      "2023-2024": {
        "Grade 9 Mathematics": 58,
        "OSSLT": 81
      },
      "2024-2025": {
        "Grade 9 Mathematics": 68,
        "OSSLT": 83
      }
    }
  },
  {
    name: "Huron Heights Secondary School",
    board: "WRDSB",
    level: "Secondary",
    coordinates: [43.4079, -80.4907],
    address: "1825 Strasburg Rd, Kitchener, ON N2R 1Y3",
    enrollment: 1500,
    eqao: {
      "2022-2023": {
        "Grade 9 Mathematics": 52,
        "OSSLT": 83
      },
      "2023-2024": {
        "Grade 9 Mathematics": 54,
        "OSSLT": 84
      },
      "2024-2025": {
        "Grade 9 Mathematics": 63,
        "OSSLT": 85
      }
    }
  },
  {
    name: "Grand River Collegiate Institute",
    board: "WRDSB",
    level: "Secondary",
    coordinates: [43.4688, -80.4357],
    address: "175 Indian Rd, Kitchener, ON N2B 2S7",
    enrollment: 1150,
    eqao: {
      "2022-2023": {
        "Grade 9 Mathematics": 55,
        "OSSLT": 85
      },
      "2023-2024": {
        "Grade 9 Mathematics": 56,
        "OSSLT": 86
      },
      "2024-2025": {
        "Grade 9 Mathematics": 64,
        "OSSLT": 85
      }
    }
  },
  {
    name: "Galt Collegiate Institute & VS",
    board: "WRDSB",
    level: "Secondary",
    coordinates: [43.3644, -80.3150],
    address: "200 Water St N, Cambridge, ON N1R 3B8",
    enrollment: 1050,
    eqao: {
      "2022-2023": {
        "Grade 9 Mathematics": 48,
        "OSSLT": 79
      },
      "2023-2024": {
        "Grade 9 Mathematics": 50,
        "OSSLT": 80
      },
      "2024-2025": {
        "Grade 9 Mathematics": 58,
        "OSSLT": 82
      }
    }
  },
  {
    name: "Preston High School",
    board: "WRDSB",
    level: "Secondary",
    coordinates: [43.3995, -80.3541],
    address: "550 Rose St, Cambridge, ON N3H 2E6",
    enrollment: 980,
    eqao: {
      "2022-2023": {
        "Grade 9 Mathematics": 51,
        "OSSLT": 82
      },
      "2023-2024": {
        "Grade 9 Mathematics": 52,
        "OSSLT": 83
      },
      "2024-2025": {
        "Grade 9 Mathematics": 60,
        "OSSLT": 84
      }
    }
  },
  {
    name: "Southwood Secondary School",
    board: "WRDSB",
    level: "Secondary",
    coordinates: [43.3448, -80.3340],
    address: "360 Southwood Dr, Cambridge, ON N1S 3S9",
    enrollment: 850,
    eqao: {
      "2022-2023": {
        "Grade 9 Mathematics": 53,
        "OSSLT": 84
      },
      "2023-2024": {
        "Grade 9 Mathematics": 55,
        "OSSLT": 85
      },
      "2024-2025": {
        "Grade 9 Mathematics": 63,
        "OSSLT": 86
      }
    }
  },
  {
    name: "Elmira District Secondary School",
    board: "WRDSB",
    level: "Secondary",
    coordinates: [43.5936, -80.5513],
    address: "4 University Ave W, Elmira, ON N3B 1K2",
    enrollment: 1100,
    eqao: {
      "2022-2023": {
        "Grade 9 Mathematics": 63,
        "OSSLT": 87
      },
      "2023-2024": {
        "Grade 9 Mathematics": 65,
        "OSSLT": 88
      },
      "2024-2025": {
        "Grade 9 Mathematics": 73,
        "OSSLT": 88
      }
    }
  },

  // ==================== SECONDARY SCHOOLS (WCDSB) ====================
  {
    name: "St. David Catholic Secondary School",
    board: "WCDSB",
    level: "Secondary",
    coordinates: [43.4883, -80.5361],
    address: "4 High St, Waterloo, ON N2L 3X9",
    enrollment: 1050,
    eqao: {
      "2022-2023": {
        "Grade 9 Mathematics": 67,
        "OSSLT": 89
      },
      "2023-2024": {
        "Grade 9 Mathematics": 69,
        "OSSLT": 90
      },
      "2024-2025": {
        "Grade 9 Mathematics": 75,
        "OSSLT": 90
      }
    }
  },
  {
    name: "Resurrection Catholic Secondary School",
    board: "WCDSB",
    level: "Secondary",
    coordinates: [43.4385, -80.5401],
    address: "455 University Ave W, Kitchener, ON N2N 3B9",
    enrollment: 1450,
    eqao: {
      "2022-2023": {
        "Grade 9 Mathematics": 64,
        "OSSLT": 88
      },
      "2023-2024": {
        "Grade 9 Mathematics": 65,
        "OSSLT": 89
      },
      "2024-2025": {
        "Grade 9 Mathematics": 72,
        "OSSLT": 90
      }
    }
  },
  {
    name: "St. Mary's High School",
    board: "WCDSB",
    level: "Secondary",
    coordinates: [43.4211, -80.4497],
    address: "1500 Blockline Rd, Kitchener, ON N2C 2G2",
    enrollment: 1900,
    eqao: {
      "2022-2023": {
        "Grade 9 Mathematics": 60,
        "OSSLT": 85
      },
      "2023-2024": {
        "Grade 9 Mathematics": 61,
        "OSSLT": 86
      },
      "2024-2025": {
        "Grade 9 Mathematics": 68,
        "OSSLT": 87
      }
    }
  },
  {
    name: "St. Benedict Catholic Secondary School",
    board: "WCDSB",
    level: "Secondary",
    coordinates: [43.3857, -80.3129],
    address: "50 Saginaw Pkwy, Cambridge, ON N1R 5W1",
    enrollment: 1350,
    eqao: {
      "2022-2023": {
        "Grade 9 Mathematics": 58,
        "OSSLT": 85
      },
      "2023-2024": {
        "Grade 9 Mathematics": 60,
        "OSSLT": 86
      },
      "2024-2025": {
        "Grade 9 Mathematics": 66,
        "OSSLT": 87
      }
    }
  },

  // ==================== ELEMENTARY SCHOOLS (WRDSB) ====================
  {
    name: "Laurelwood Public School",
    board: "WRDSB",
    level: "Elementary",
    coordinates: [43.4682, -80.5794],
    address: "460 Laurelwood Dr, Waterloo, ON N2V 2V1",
    enrollment: 620,
    eqao: {
      "2022-2023": {
        "Grade 3 Reading": 82,
        "Grade 3 Writing": 76,
        "Grade 3 Mathematics": 78,
        "Grade 6 Reading": 89,
        "Grade 6 Writing": 87,
        "Grade 6 Mathematics": 68
      },
      "2023-2024": {
        "Grade 3 Reading": 80,
        "Grade 3 Writing": 75,
        "Grade 3 Mathematics": 76,
        "Grade 6 Reading": 88,
        "Grade 6 Writing": 86,
        "Grade 6 Mathematics": 66
      },
      "2024-2025": {
        "Grade 3 Reading": 84,
        "Grade 3 Writing": 78,
        "Grade 3 Mathematics": 80,
        "Grade 6 Reading": 91,
        "Grade 6 Writing": 90,
        "Grade 6 Mathematics": 70
      }
    }
  },
  {
    name: "Edna Staebler Public School",
    board: "WRDSB",
    level: "Elementary",
    coordinates: [43.4566, -80.5695],
    address: "450 Bernay Dr, Waterloo, ON N2T 2Z9",
    enrollment: 780,
    eqao: {
      "2022-2023": {
        "Grade 3 Reading": 74,
        "Grade 3 Writing": 68,
        "Grade 3 Mathematics": 67,
        "Grade 6 Reading": 85,
        "Grade 6 Writing": 84,
        "Grade 6 Mathematics": 55
      },
      "2023-2024": {
        "Grade 3 Reading": 73,
        "Grade 3 Writing": 66,
        "Grade 3 Mathematics": 68,
        "Grade 6 Reading": 84,
        "Grade 6 Writing": 82,
        "Grade 6 Mathematics": 56
      },
      "2024-2025": {
        "Grade 3 Reading": 77,
        "Grade 3 Writing": 70,
        "Grade 3 Mathematics": 72,
        "Grade 6 Reading": 87,
        "Grade 6 Writing": 86,
        "Grade 6 Mathematics": 59
      }
    }
  },
  {
    name: "Abraham Erb Public School",
    board: "WRDSB",
    level: "Elementary",
    coordinates: [43.4697, -80.5606],
    address: "710 Laurelwood Dr, Waterloo, ON N2V 2V1",
    enrollment: 500,
    eqao: {
      "2022-2023": {
        "Grade 3 Reading": 84,
        "Grade 3 Writing": 78,
        "Grade 3 Mathematics": 80,
        "Grade 6 Reading": 91,
        "Grade 6 Writing": 89,
        "Grade 6 Mathematics": 72
      },
      "2023-2024": {
        "Grade 3 Reading": 83,
        "Grade 3 Writing": 76,
        "Grade 3 Mathematics": 79,
        "Grade 6 Reading": 90,
        "Grade 6 Writing": 88,
        "Grade 6 Mathematics": 70
      },
      "2024-2025": {
        "Grade 3 Reading": 86,
        "Grade 3 Writing": 80,
        "Grade 3 Mathematics": 83,
        "Grade 6 Reading": 93,
        "Grade 6 Writing": 92,
        "Grade 6 Mathematics": 75
      }
    }
  },
  {
    name: "Vista Hills Public School",
    board: "WRDSB",
    level: "Elementary",
    coordinates: [43.4475, -80.5947],
    address: "314 Sweet Gale St, Waterloo, ON N2V 0B4",
    enrollment: 800,
    eqao: {
      "2022-2023": {
        "Grade 3 Reading": 78,
        "Grade 3 Writing": 70,
        "Grade 3 Mathematics": 72,
        "Grade 6 Reading": 87,
        "Grade 6 Writing": 86,
        "Grade 6 Mathematics": 61
      },
      "2023-2024": {
        "Grade 3 Reading": 76,
        "Grade 3 Writing": 69,
        "Grade 3 Mathematics": 70,
        "Grade 6 Reading": 86,
        "Grade 6 Writing": 84,
        "Grade 6 Mathematics": 60
      },
      "2024-2025": {
        "Grade 3 Reading": 80,
        "Grade 3 Writing": 73,
        "Grade 3 Mathematics": 74,
        "Grade 6 Reading": 89,
        "Grade 6 Writing": 87,
        "Grade 6 Mathematics": 64
      }
    }
  },
  {
    name: "Sandhills Public School",
    board: "WRDSB",
    level: "Elementary",
    coordinates: [43.4285, -80.5280],
    address: "1250 Sweetwood Dr, Kitchener, ON N2N 3J8",
    enrollment: 700,
    eqao: {
      "2022-2023": {
        "Grade 3 Reading": 67,
        "Grade 3 Writing": 58,
        "Grade 3 Mathematics": 56,
        "Grade 6 Reading": 80,
        "Grade 6 Writing": 79,
        "Grade 6 Mathematics": 45
      },
      "2023-2024": {
        "Grade 3 Reading": 66,
        "Grade 3 Writing": 57,
        "Grade 3 Mathematics": 56,
        "Grade 6 Reading": 79,
        "Grade 6 Writing": 77,
        "Grade 6 Mathematics": 46
      },
      "2024-2025": {
        "Grade 3 Reading": 70,
        "Grade 3 Writing": 60,
        "Grade 3 Mathematics": 60,
        "Grade 6 Reading": 82,
        "Grade 6 Writing": 81,
        "Grade 6 Mathematics": 48
      }
    }
  },
  {
    name: "Millen Woods Public School",
    board: "WRDSB",
    level: "Elementary",
    coordinates: [43.5041, -80.4998],
    address: "508 Millennium Blvd, Waterloo, ON N2K 4A6",
    enrollment: 480,
    eqao: {
      "2022-2023": {
        "Grade 3 Reading": 81,
        "Grade 3 Writing": 73,
        "Grade 3 Mathematics": 76,
        "Grade 6 Reading": 89,
        "Grade 6 Writing": 86,
        "Grade 6 Mathematics": 66
      },
      "2023-2024": {
        "Grade 3 Reading": 79,
        "Grade 3 Writing": 71,
        "Grade 3 Mathematics": 74,
        "Grade 6 Reading": 87,
        "Grade 6 Writing": 84,
        "Grade 6 Mathematics": 64
      },
      "2024-2025": {
        "Grade 3 Reading": 83,
        "Grade 3 Writing": 75,
        "Grade 3 Mathematics": 78,
        "Grade 6 Reading": 90,
        "Grade 6 Writing": 88,
        "Grade 6 Mathematics": 68
      }
    }
  },
  {
    name: "Bridgeport Public School",
    board: "WRDSB",
    level: "Elementary",
    coordinates: [43.4831, -80.4651],
    address: "90 Bridge St W, Kitchener, ON N2K 1K9",
    enrollment: 350,
    eqao: {
      "2022-2023": {
        "Grade 3 Reading": 70,
        "Grade 3 Writing": 61,
        "Grade 3 Mathematics": 58,
        "Grade 6 Reading": 82,
        "Grade 6 Writing": 81,
        "Grade 6 Mathematics": 49
      },
      "2023-2024": {
        "Grade 3 Reading": 69,
        "Grade 3 Writing": 60,
        "Grade 3 Mathematics": 59,
        "Grade 6 Reading": 81,
        "Grade 6 Writing": 80,
        "Grade 6 Mathematics": 50
      },
      "2024-2025": {
        "Grade 3 Reading": 71,
        "Grade 3 Writing": 62,
        "Grade 3 Mathematics": 61,
        "Grade 6 Reading": 83,
        "Grade 6 Writing": 82,
        "Grade 6 Mathematics": 51
      }
    }
  },

  // ==================== ELEMENTARY SCHOOLS (WCDSB) ====================
  {
    name: "St. Luke Catholic Elementary School",
    board: "WCDSB",
    level: "Elementary",
    coordinates: [43.4913, -80.5097],
    address: "550 Chesapeake Dr, Waterloo, ON N2K 4G5",
    enrollment: 550,
    eqao: {
      "2022-2023": {
        "Grade 3 Reading": 83,
        "Grade 3 Writing": 75,
        "Grade 3 Mathematics": 77,
        "Grade 6 Reading": 90,
        "Grade 6 Writing": 88,
        "Grade 6 Mathematics": 67
      },
      "2023-2024": {
        "Grade 3 Reading": 82,
        "Grade 3 Writing": 74,
        "Grade 3 Mathematics": 76,
        "Grade 6 Reading": 89,
        "Grade 6 Writing": 86,
        "Grade 6 Mathematics": 66
      },
      "2024-2025": {
        "Grade 3 Reading": 85,
        "Grade 3 Writing": 77,
        "Grade 3 Mathematics": 80,
        "Grade 6 Reading": 91,
        "Grade 6 Writing": 89,
        "Grade 6 Mathematics": 69
      }
    }
  },
  {
    name: "St. Nicholas Catholic Elementary School",
    board: "WCDSB",
    level: "Elementary",
    coordinates: [43.4477, -80.5599],
    address: "525 Laurelwood Dr, Waterloo, ON N2V 2N1",
    enrollment: 420,
    eqao: {
      "2022-2023": {
        "Grade 3 Reading": 81,
        "Grade 3 Writing": 72,
        "Grade 3 Mathematics": 74,
        "Grade 6 Reading": 88,
        "Grade 6 Writing": 85,
        "Grade 6 Mathematics": 63
      },
      "2023-2024": {
        "Grade 3 Reading": 80,
        "Grade 3 Writing": 71,
        "Grade 3 Mathematics": 73,
        "Grade 6 Reading": 87,
        "Grade 6 Writing": 83,
        "Grade 6 Mathematics": 62
      },
      "2024-2025": {
        "Grade 3 Reading": 83,
        "Grade 3 Writing": 75,
        "Grade 3 Mathematics": 77,
        "Grade 6 Reading": 90,
        "Grade 6 Writing": 87,
        "Grade 6 Mathematics": 66
      }
    }
  },
  {
    name: "Our Lady of Lourdes Catholic School",
    board: "WCDSB",
    level: "Elementary",
    coordinates: [43.4619, -80.5317],
    address: "55 Lourdes St, Waterloo, ON N2L 1N2",
    enrollment: 380,
    eqao: {
      "2022-2023": {
        "Grade 3 Reading": 73,
        "Grade 3 Writing": 65,
        "Grade 3 Mathematics": 61,
        "Grade 6 Reading": 84,
        "Grade 6 Writing": 82,
        "Grade 6 Mathematics": 50
      },
      "2023-2024": {
        "Grade 3 Reading": 71,
        "Grade 3 Writing": 63,
        "Grade 3 Mathematics": 60,
        "Grade 6 Reading": 83,
        "Grade 6 Writing": 80,
        "Grade 6 Mathematics": 49
      },
      "2024-2025": {
        "Grade 3 Reading": 74,
        "Grade 3 Writing": 66,
        "Grade 3 Mathematics": 64,
        "Grade 6 Reading": 85,
        "Grade 6 Writing": 83,
        "Grade 6 Mathematics": 52
      }
    }
  }
];
