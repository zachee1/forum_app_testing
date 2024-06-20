let dbMock = {};
global.cds = require('@sap/cds');

module.exports = {
    initUnitTestMocks: () => {
        const UPDATE = jest.fn().mockImplementation((entity, id) => {
            if (entity) {
                UPDATE.updateEntity = entity;
            }
            if (id) {
                UPDATE.updateCondition = { ID: id };
            } else {
                UPDATE.updateCondition = null;
            }
            UPDATE.updateValues = null;
            return UPDATE;
        });

        Object.assign(UPDATE, {
            updateEntity: null,
            updateCondition: null,
            updateValues: null,
            entity: jest.fn().mockImplementation((entity, id) => {
                if (entity) {
                    UPDATE.updateEntity = entity;
                }
                if (id) {
                    UPDATE.updateCondition = { ID: id };
                } else {
                    UPDATE.updateCondition = null;
                }
                UPDATE.updateValues = null;
                return UPDATE;
            }),
            set: jest.fn().mockImplementation((values) => {
                UPDATE.updateValues = values;
                return UPDATE;
            }),
            with: jest.fn().mockImplementation((values) => {
                UPDATE.updateValues = values;
                return UPDATE;
            }),
            where: jest.fn().mockImplementation((condition) => {
                UPDATE.updateCondition = condition;
                return Promise.resolve(); // Ensure the mock returns a promise
            })
        });

        Object.assign(dbMock, {
            run: jest.fn().mockImplementation((query) => {
                let entity = query.updateEntity;
                let condition = query.updateCondition;

                if (dbMock.returnData[entity]) {
                    for (let data of dbMock.returnData[entity]) {
                        if (condition && data.condition) {
                            let fulfilsCondition = Object.keys(condition).every(key =>
                                JSON.stringify(condition[key]) === JSON.stringify(data.condition[key])
                            );
                            if (fulfilsCondition) {
                                if (query.updateValues) {
                                    return applyUpdate(data.value, query.updateValues);
                                }
                                data.timesProcessed += 1;
                                return data.value;
                            }
                        } else {
                            if (query.updateValues) {
                                return applyUpdate(data.value, query.updateValues);
                            }
                            return data.value;
                        }
                    }
                }

                if (query.data) {
                    return query.data[0] || query.data;
                }
                if (dbMock.returnData['default']) {
                    return dbMock.returnData['default'][0].value;
                }
                return [];
            }),
            returnData: {},
            forEntity: (entityName) => {
                dbMock.currentEntity = entityName;
                return dbMock;
            },
            withCondition: (condition) => {
                dbMock.condition = condition;
                return dbMock;
            },
            retrieve: (data) => {
                if (!dbMock.returnData[dbMock.currentEntity]) {
                    dbMock.returnData[dbMock.currentEntity] = [];
                }
                dbMock.returnData[dbMock.currentEntity].push({
                    entity: dbMock.currentEntity,
                    value: data,
                    condition: dbMock.condition,
                    timesProcessed: 0,
                    timesMocked: 1
                });
                dbMock.condition = null;
                return {
                    times: (qty) => {
                        const entityData = dbMock.returnData[dbMock.currentEntity];
                        const lastEntryIndex = entityData.length - 1;
                        dbMock.currentEntity = null;
                        if (!qty || isNaN(qty) || qty <= 0) {
                            entityData[lastEntryIndex].timesMocked = 0;
                            return dbMock;
                        }
                        entityData[lastEntryIndex].timesMocked = qty;
                        return dbMock;
                    }
                };
            }
        });

        return dbMock;
    }
};
