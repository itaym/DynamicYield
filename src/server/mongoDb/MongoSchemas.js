module.exports =  {
    users : {
        validator: {
            $jsonSchema: {
                bsonType: "object",
                required: [ "name", "password" ],
                properties: {
                    name: {
                        bsonType: "string",
                        minLength: 3,
                        maxLength: 24,
                        description: "must be a string and is required"
                    },
                    lastLogin: {
                        bsonType: "date",
                        description: "must be a date."
                    },
                    password: {
                        bsonType: "object",
                        required: [ "salt", "hash" ],
                        properties: {
                            salt: {
                                bsonType: "string",
                                minLength: 16,
                                maxLength: 16,
                                description: "must be a string and is required."
                            },
                            hash: {
                                bsonType: "string",
                                minLength: 128,
                                maxLength: 128,
                                "description": "must be a string and is required."
                            }
                        }
                    }
                }
            }
        }
    },
    rooms : {
        validator: {
            $jsonSchema: {
                bsonType: "object",
                required: [ "name" ],
                properties: {
                    name: {
                        bsonType: "string",
                        minLength: 3,
                        maxLength: 24,
                        description: "must be a string (3 to 24 characters) and is required."
                    }
                }
            }
        }
    },
    meeting_of_ : {
        validator: {
            $jsonSchema: {
                bsonType: "object",
                required: [ "owner", "fromTime", "toTime", "description"],
                properties: {
                    owner: {
                        bsonType: "string",
                        minLength: 3,
                        maxLength: 24,
                    },
                    fromTime: {
                        bsonType: "date",
                        description: "must be a date and is required."
                    },
                    toTime: {
                        bsonType: "date",
                        description: "must be a date and is required."
                    },
                    description : {
                        bsonType: "string",
                        minLength: 3,
                        maxLength: 400
                    }
                }
            }
        }
    }
};