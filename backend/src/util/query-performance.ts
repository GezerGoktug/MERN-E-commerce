import mongoose from "mongoose";
import logger from "../config/logger";

type MongooseQuery = mongoose.Query<any, any>;

interface IExplainExecutionStats {
    totalDocsExamined: number;
    totalKeysExamined: number;
    nReturned: number;
    executionTimeMillis: number;
    executionStages: {
        works: number;
        [key: string]: any;
    };
}

interface IMongooseExplainResult {
    executionStats: IExplainExecutionStats;
}

interface IPerformanceMetrics {
    scannedDocsCount: number;
    examinedKeysCount: number;
    returnedDocCount: number;
    executionTimeMs: number;
    totalWorkUnits: number;
}

const getPerformanceParameters = (perfStatsData: IMongooseExplainResult): IPerformanceMetrics => {
    return {
        scannedDocsCount: perfStatsData.executionStats.totalDocsExamined,
        examinedKeysCount: perfStatsData.executionStats.totalKeysExamined,
        returnedDocCount: perfStatsData.executionStats.nReturned,
        executionTimeMs: perfStatsData.executionStats.executionTimeMillis,
        totalWorkUnits: perfStatsData.executionStats.executionStages.works 
    }
}

//  we expecting has bad performance metrics for variantA , we expecting has better performance metrics for variantB
const comparePerfMetrics = (variantA: IPerformanceMetrics, variantB: IPerformanceMetrics, totalDocsCount: number) => {
    
    const scannedDocsSaved = variantA.scannedDocsCount - variantB.scannedDocsCount;
    const timeSavedMs = variantA.executionTimeMs - variantB.executionTimeMs;
    const workUnitsSaved = variantA.totalWorkUnits - variantB.totalWorkUnits;

    const expectedScanDocCount = variantA.returnedDocCount;
    const range = totalDocsCount - expectedScanDocCount;
    
    let indexEfficiencyPerformance = 0;
    if (range > 0) {
        indexEfficiencyPerformance = (
            (
                (variantA.examinedKeysCount === 0 ? range : (variantA.examinedKeysCount - expectedScanDocCount))
                -
                (variantB.examinedKeysCount === 0 ? range : (variantB.examinedKeysCount - expectedScanDocCount))
            ) / range
        );
    }

    const formatChange = (savedValue: number, unit: string) => {
        if (savedValue > 0) return `Decreased by ${savedValue} ${unit}`;
        if (savedValue < 0) return `Increased by ${Math.abs(savedValue)} ${unit}`;
        return `Unchanged (0 ${unit})`;
    };

    return `
        Scanned Docs     : ${formatChange(scannedDocsSaved, "docs")}
        Index Efficiency : ${indexEfficiencyPerformance > 0 ? "+" : ""}${(indexEfficiencyPerformance * 100).toFixed(2)}% Efficiency Increase
        Run Time         : ${formatChange(timeSavedMs, "ms")}
        Total Work Units : ${formatChange(workUnitsSaved, "units")}
    `;
}

const queryPerformanceCompare = async (query: MongooseQuery) => {
    try {
        const Model = query.model;
        const totalDocsCount = await Model.countDocuments();

        const [perfStatsWithIndex, naturalQueryStatsWithoutIndexes] = await Promise.all([
            query.clone().explain("executionStats") as unknown as IMongooseExplainResult,
            query.clone().hint({ $natural: 1 }).explain("executionStats") as unknown as IMongooseExplainResult
        ]);

        logger.info("Query Performance Report \n" + comparePerfMetrics(
            getPerformanceParameters(naturalQueryStatsWithoutIndexes),
            getPerformanceParameters(perfStatsWithIndex),
            totalDocsCount
        ));

    } catch (error) {
        logger.error("Error occurred when running query performance analyzer: ", error);
    }
}

export default queryPerformanceCompare;