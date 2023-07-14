import mongoose from "mongoose";


const craScheduleSchema = new mongoose.Schema({
    data: {
        cohort: {type: String, required: true},
        startDate: {type: String, required: true},
        endDate: {type: String, required: true},
        cDay: {
            startTime: {type: String, required: true},
            endTime: {type: String, required: true}
        }
    },
    exceptions: {},
    cDay1: {
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
    cDay2: {
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
    cDay3: {
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
    cDay4: {
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
    cDay5: {
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
    cDay6: {
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
    cDay7: {
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
    cDay8: {
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
    cDay9: {
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
    cDay10: {
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
    cDay11: {
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
    cDay12: {
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
    cDay13: {
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
    cDay14: {
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
    cDay15: {
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
    cDay16: {
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
    cDay17: {
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
    cDay18: {
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

export default mongoose.model("birthdaySchema", craScheduleSchema, "bday");
