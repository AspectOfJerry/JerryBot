const mongoose = require("mongoose");


const craScheduleSchema = new mongoose.Schema({
    data: {
        cohort: {type: String, required: true},
        startDate: {type: String, required: true},
        endDate: {type: String, required: true},
        jour: {
            startTime: {type: String, required: true},
            endTime: {type: String, required: true}
        }
    },
    exceptions: {},
    jour1: {
        p1: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: true}
        },
        p2: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: true}
        },
        p3: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: true}
        },
        p4: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: true}
        },
        p5: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: true}
        },
        p6: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: true}
        }
    },
    jour2: {
        p1: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: true}
        },
        p2: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: true}
        },
        p3: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: true}
        },
        p4: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: true}
        },
        p5: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: true}
        },
        p6: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: true}
        }
    },
    jour3: {
        p1: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: true}
        },
        p2: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: true}
        },
        p3: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: true}
        },
        p4: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: true}
        },
        p5: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: true}
        },
        p6: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: true}
        }
    },
    jour4: {
        p1: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: true}
        },
        p2: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: true}
        },
        p3: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: true}
        },
        p4: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: true}
        },
        p5: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: true}
        },
        p6: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: true}
        }
    },
    jour5: {
        p1: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: true}
        },
        p2: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: true}
        },
        p3: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: true}
        },
        p4: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: true}
        },
        p5: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: true}
        },
        p6: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: true}
        }
    },
    jour6: {
        p1: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: true}
        },
        p2: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: true}
        },
        p3: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: true}
        },
        p4: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: true}
        },
        p5: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: true}
        },
        p6: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: true}
        }
    },
    jour7: {
        p1: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: true}
        },
        p2: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: true}
        },
        p3: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: true}
        },
        p4: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: true}
        },
        p5: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: true}
        },
        p6: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: true}
        }
    },
    jour8: {
        p1: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: true}
        },
        p2: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: true}
        },
        p3: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: true}
        },
        p4: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: true}
        },
        p5: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: true}
        },
        p6: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: true}
        }
    },
    jour9: {
        p1: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: true}
        },
        p2: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: true}
        },
        p3: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: true}
        },
        p4: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: true}
        },
        p5: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: true}
        },
        p6: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: true}
        }
    },
    jour10: {
        p1: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: true}
        },
        p2: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: true}
        },
        p3: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: true}
        },
        p4: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: true}
        },
        p5: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: true}
        },
        p6: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: true}
        }
    },
    jour11: {
        p1: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: true}
        },
        p2: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: true}
        },
        p3: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: true}
        },
        p4: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: true}
        },
        p5: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: true}
        },
        p6: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: true}
        }
    },
    jour12: {
        p1: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: true}
        },
        p2: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: true}
        },
        p3: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: true}
        },
        p4: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: true}
        },
        p5: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: true}
        },
        p6: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: true}
        }
    },
    jour13: {
        p1: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: true}
        },
        p2: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: true}
        },
        p3: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: true}
        },
        p4: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: true}
        },
        p5: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: true}
        },
        p6: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: true}
        }
    },
    jour14: {
        p1: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: true}
        },
        p2: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: true}
        },
        p3: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: true}
        },
        p4: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: true}
        },
        p5: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: true}
        },
        p6: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: true}
        }
    },
    jour15: {
        p1: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: true}
        },
        p2: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: true}
        },
        p3: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: true}
        },
        p4: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: true}
        },
        p5: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: true}
        },
        p6: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: true}
        }
    },
    jour16: {
        p1: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: true}
        },
        p2: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: true}
        },
        p3: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: true}
        },
        p4: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: true}
        },
        p5: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: true}
        },
        p6: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: true}
        }
    },
    jour17: {
        p1: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: true}
        },
        p2: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: true}
        },
        p3: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: true}
        },
        p4: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: true}
        },
        p5: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: true}
        },
        p6: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: true}
        }
    },
    jour18: {
        p1: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: true}
        },
        p2: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: true}
        },
        p3: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: true}
        },
        p4: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: true}
        },
        p5: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: true}
        },
        p6: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: true}
        }
    }
});

module.exports = mongoose.model("birthdaySchema", craScheduleSchema, "bday");
