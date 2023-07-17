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
    cDay1: {
        p1: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: false}
        },
        p2: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: false}
        },
        p3: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: false}
        },
        p4: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: false}
        },
        p5: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: false}
        },
        p6: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: false}
        }
    },
    cDay2: {
        p1: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: false}
        },
        p2: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: false}
        },
        p3: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: false}
        },
        p4: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: false}
        },
        p5: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: false}
        },
        p6: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: false}
        }
    },
    cDay3: {
        p1: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: false}
        },
        p2: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: false}
        },
        p3: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: false}
        },
        p4: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: false}
        },
        p5: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: false}
        },
        p6: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: false}
        }
    },
    cDay4: {
        p1: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: false}
        },
        p2: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: false}
        },
        p3: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: false}
        },
        p4: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: false}
        },
        p5: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: false}
        },
        p6: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: false}
        }
    },
    cDay5: {
        p1: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: false}
        },
        p2: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: false}
        },
        p3: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: false}
        },
        p4: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: false}
        },
        p5: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: false}
        },
        p6: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: false}
        }
    },
    cDay6: {
        p1: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: false}
        },
        p2: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: false}
        },
        p3: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: false}
        },
        p4: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: false}
        },
        p5: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: false}
        },
        p6: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: false}
        }
    },
    cDay7: {
        p1: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: false}
        },
        p2: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: false}
        },
        p3: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: false}
        },
        p4: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: false}
        },
        p5: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: false}
        },
        p6: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: false}
        }
    },
    cDay8: {
        p1: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: false}
        },
        p2: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: false}
        },
        p3: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: false}
        },
        p4: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: false}
        },
        p5: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: false}
        },
        p6: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: false}
        }
    },
    cDay9: {
        p1: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: false}
        },
        p2: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: false}
        },
        p3: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: false}
        },
        p4: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: false}
        },
        p5: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: false}
        },
        p6: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: false}
        }
    },
    cDay10: {
        p1: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: false}
        },
        p2: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: false}
        },
        p3: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: false}
        },
        p4: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: false}
        },
        p5: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: false}
        },
        p6: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: false}
        }
    },
    cDay11: {
        p1: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: false}
        },
        p2: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: false}
        },
        p3: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: false}
        },
        p4: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: false}
        },
        p5: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: false}
        },
        p6: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: false}
        }
    },
    cDay12: {
        p1: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: false}
        },
        p2: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: false}
        },
        p3: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: false}
        },
        p4: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: false}
        },
        p5: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: false}
        },
        p6: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: false}
        }
    },
    cDay13: {
        p1: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: false}
        },
        p2: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: false}
        },
        p3: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: false}
        },
        p4: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: false}
        },
        p5: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: false}
        },
        p6: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: false}
        }
    },
    cDay14: {
        p1: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: false}
        },
        p2: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: false}
        },
        p3: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: false}
        },
        p4: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: false}
        },
        p5: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: false}
        },
        p6: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: false}
        }
    },
    cDay15: {
        p1: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: false}
        },
        p2: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: false}
        },
        p3: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: false}
        },
        p4: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: false}
        },
        p5: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: false}
        },
        p6: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: false}
        }
    },
    cDay16: {
        p1: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: false}
        },
        p2: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: false}
        },
        p3: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: false}
        },
        p4: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: false}
        },
        p5: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: false}
        },
        p6: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: false}
        }
    },
    cDay17: {
        p1: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: false}
        },
        p2: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: false}
        },
        p3: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: false}
        },
        p4: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: false}
        },
        p5: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: false}
        },
        p6: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: false}
        }
    },
    cDay18: {
        p1: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: false}
        },
        p2: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: false}
        },
        p3: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: false}
        },
        p4: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: false}
        },
        p5: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: false}
        },
        p6: {
            classCode: {type: String, required: true},
            classroom: {type: String, required: true},
            notes: {type: String, required: false}
        }
    }
});

export default mongoose.model("craScheduleSchema", craScheduleSchema, "cra");
