/*
Container Class to handle Amino Acid object.
    - manages 1-letter-codes vs. 3-letter-codes
    - manage non-standard amino acids
*/


// Main ------------------------------------------------------------------------
export class AminoAcid {

    // Constants ---------------------------------------------------------------

    // Base AminoAcid properties
    static STANDARD_AAS = [
        {one: 'A', three: 'ALA', name: 'Alanine',       id: 1},
        {one: 'C', three: 'CYS', name: 'Cysteine',      id: 2},
        {one: 'D', three: 'ASP', name: 'Aspartate',     id: 3},
        {one: 'E', three: 'GLU', name: 'Glutamate',     id: 4},
        {one: 'F', three: 'PHE', name: 'Phenylalanine', id: 5},
        {one: 'G', three: 'GLY', name: 'Glycine',       id: 6},
        {one: 'H', three: 'HIS', name: 'Histidine',     id: 7},
        {one: 'I', three: 'ILE', name: 'Isoleucine',    id: 8},
        {one: 'K', three: 'LYS', name: 'Lysine',        id: 9},
        {one: 'L', three: 'LEU', name: 'Leucine',       id: 10},
        {one: 'M', three: 'MET', name: 'Methionine',    id: 11},
        {one: 'N', three: 'ASN', name: 'Asparagine',    id: 12},
        {one: 'P', three: 'PRO', name: 'Proline',       id: 13},
        {one: 'Q', three: 'GLN', name: 'Glutamine',     id: 14},
        {one: 'R', three: 'ARG', name: 'Arginine',      id: 15},
        {one: 'S', three: 'SER', name: 'Serine',        id: 16},
        {one: 'T', three: 'THR', name: 'Thréonine',     id: 17},
        {one: 'V', three: 'VAL', name: 'Valine',        id: 18},
        {one: 'W', three: 'TRP', name: 'Tryptophane',   id: 19},
        {one: 'Y', three: 'TYR', name: 'Tyrosine',      id: 20},
    ];

    // Map 3-letter -> AA
    static STANDARD_AAS_MAP = AminoAcid.STANDARD_AAS.reduce((acc, curr) => {
        acc[curr.three] = curr;
        return acc;
    }, {});

    // Map 3-letters <-> 1-letters
    static THREE_TO_ONE = AminoAcid.STANDARD_AAS.reduce((acc, curr) => {
        acc[curr.three] = curr.one;
        return acc;
    }, {});

    static ONE_TO_THREE = AminoAcid.STANDARD_AAS.reduce((acc, curr) => {
        acc[curr.one] = curr.three;
        return acc;
    }, {});

    // Non-Standard Amino Acids three-letter-codes mapped to closest Standard Amino Acids
    static NON_STANDARD_AAS_MAP = {
        // WARNING: We do not represent here ambiguous mappings like:   "GLX" => "GLN" or "GLU"
        "4HT": "TRP", "CLG": "LYS", "HSE": "SER", "BIF": "PHE", "B3D": "ASP", "BB8": "PHE", "3MY": "TYR", "SNK": "HIS",
        "3CF": "PHE", "A5N": "ASN", "LED": "LEU", "TOX": "TRP", "CR5": "GLY", "ILM": "ILE", "0A9": "PHE", "DAS": "ASP",
        "NYS": "CYS", "73P": "LYS", "MSO": "MET", "IYR": "TYR", "PR9": "PRO", "R4K": "TRP", "L5P": "LYS", "31Q": "CYS",
        "OCY": "CYS", "BH2": "ASP", "XSN": "ASN", "SXE": "SER", "GMA": "GLU", "SEP": "SER", "CYD": "CYS", "YPZ": "TYR",
        "GPL": "LYS", "RVX": "SER", "YCM": "CYS", "SEL": "SER", "DNE": "LEU", "LEN": "LEU", "4FB": "PRO", "4OU": "PHE",
        "LGY": "LYS", "TTQ": "TRP", "DBB": "THR", "LBZ": "LYS", "QX7": "ALA", "H14": "PHE", "CIR": "ARG", "73O": "TYR",
        "EI4": "ARG", "LVN": "VAL", "SRZ": "SER", "55I": "PHE", "UF0": "SER", "YHA": "LYS", "QM8": "ALA", "TQQ": "TRP",
        "QIL": "ILE", "Q75": "MET", "11Q": "PRO", "A8E": "VAL", "DHV": "VAL", "3BY": "PRO", "2ZC": "SER", "T9E": "THR",
        "CSZ": "CYS", "5CS": "CYS", "KPI": "LYS", "0AH": "SER", "HSK": "HIS", "TH6": "THR", "ARO": "ARG", "E9V": "HIS",
        "UXQ": "PHE", "MHL": "LEU", "CAS": "CYS", "8RE": "LYS", "LLP": "LYS", "PTH": "TYR", "ORQ": "ARG", "73N": "ARG",
        "BTK": "LYS", "HVA": "VAL", "LMQ": "GLN", "FME": "MET", "XX1": "LYS", "I7F": "SER", "4N9": "PRO", "TYJ": "TYR",
        "BOR": "ARG", "HL2": "LEU", "73C": "SER", "0CS": "ALA", "AGM": "ARG", "CYW": "CYS", "ASL": "ASP", "I3D": "TRP",
        "NPH": "CYS", "JKH": "PRO", "QMB": "ALA", "XCN": "CYS", "PHI": "PHE", "NAL": "ALA", "LYZ": "LYS", "6M6": "CYS",
        "VAD": "VAL", "EXL": "TRP", "WFP": "PHE", "823": "ASN", "CLH": "LYS", "C6C": "CYS", "DCY": "CYS", "DPP": "ALA",
        "KHB": "LYS", "DNW": "ALA", "BUC": "CYS", "CSU": "CYS", "H5M": "PRO", "RXL": "VAL", "FOE": "CYS", "GHP": "GLY",
        "2KP": "LYS", "OMX": "TYR", "ZCL": "PHE", "MGG": "ARG", "DLS": "LYS", "30V": "CYS", "02K": "ALA", "DA2": "ARG",
        "TYY": "TYR", "HRG": "ARG", "PHL": "PHE", "PRJ": "PRO", "M2L": "LYS", "SUN": "SER", "TSY": "CYS", "PF5": "PHE",
        "4CF": "PHE", "1OP": "TYR", "CSB": "CYS", "POM": "PRO", "ELY": "LYS", "TRQ": "TRP", "BP5": "ALA", "5VV": "ASN",
        "6DN": "LYS", "MIS": "SER", "MLZ": "LYS", "EME": "GLU", "4J5": "ARG", "MPQ": "GLY", "LLO": "LYS", "FQA": "LYS",
        "PR7": "PRO", "NLW": "LEU", "OMY": "TYR", "5CT": "LYS", "PRK": "LYS", "DPQ": "TYR", "N0A": "PHE", "3QN": "LYS",
        "K5H": "CYS", "HNC": "CYS", "TYO": "TYR", "Q3P": "LYS", "BWV": "ARG", "4L0": "PRO", "ZAL": "ALA", "IAM": "ALA",
        "AGQ": "TYR", "07O": "CYS", "PCA": "GLN", "2MR": "ARG", "TRN": "TRP", "4AR": "ARG", "HLY": "LYS", "DHI": "HIS",
        "J2F": "TYR", "C3Y": "CYS", "GL3": "GLY", "BTR": "TRP", "OYL": "HIS", "IGL": "GLY", "2GX": "PHE", "8LJ": "PRO",
        "AYA": "ALA", "XYC": "ALA", "CY1": "CYS", "CGU": "GLU", "PM3": "PHE", "03Y": "CYS", "CE7": "ASN", "HSL": "SER",
        "BXT": "SER", "MHU": "PHE", "HOX": "PHE", "5GM": "ILE", "DVA": "VAL", "CYR": "CYS", "YOF": "TYR", "DDZ": "ALA",
        "4PQ": "TRP", "ECC": "GLN", "GHG": "GLN", "IPG": "GLY", "PPN": "PHE", "L3O": "LEU", "AEA": "CYS", "7N8": "PHE",
        "AHO": "ALA", "TBG": "VAL", "BFD": "ASP", "HPE": "PHE", "5MW": "LYS", "U2X": "TYR", "N10": "SER", "TGH": "TRP",
        "51T": "TYR", "DDE": "HIS", "DBZ": "ALA", "FF9": "LYS", "HTN": "ASN", "NVA": "VAL", "HS9": "HIS", "ACB": "ASP",
        "9KP": "LYS", "FTR": "TRP", "ALS": "ALA", "DYJ": "PRO", "RPI": "ARG", "FTY": "TYR", "TQZ": "CYS", "FVA": "VAL",
        "CS4": "CYS", "QVA": "CYS", "XPR": "PRO", "0QL": "CYS", "TCQ": "TYR", "OXX": "ASP", "ZZJ": "ALA", "LDH": "LYS",
        "3CT": "TYR", "H7V": "ALA", "4N7": "PRO", "PYA": "ALA", "WVL": "VAL", "DMK": "ASP", "EFC": "CYS", "0BN": "PHE",
        "MHO": "MET", "ECX": "CYS", "ESB": "TYR", "KGC": "LYS", "3WX": "PRO", "MBQ": "TYR", "ILX": "ILE", "DSG": "ASN",
        "P2Q": "TYR", "LSO": "LYS", "6CW": "TRP", "SDP": "SER", "MP8": "PRO", "HTR": "TRP", "B3S": "SER", "TYB": "TYR",
        "PAQ": "TYR", "HS8": "HIS", "RX9": "ILE", "DHA": "SER", "CHP": "GLY", "MMO": "ARG", "FCL": "PHE", "05O": "TYR",
        "ICY": "CYS", "DIV": "VAL", "N65": "LYS", "Q78": "PHE", "KCR": "LYS", "TY8": "TYR", "GVL": "SER", "MLL": "LEU",
        "DNP": "ALA", "5XU": "ALA", "O7D": "TRP", "NFA": "PHE", "DBY": "TYR", "QCS": "CYS", "ZYK": "PRO", "IIL": "ILE",
        "ABA": "ALA", "4AW": "TRP", "BSE": "SER", "LLY": "LYS", "4D4": "ARG", "MNL": "LEU", "FGL": "GLY", "SET": "SER",
        "MYN": "ARG", "C4R": "CYS", "CZZ": "CYS", "CZS": "ALA", "Y1V": "LEU", "CWR": "SER", "NBQ": "TYR", "KYQ": "LYS",
        "2TY": "TYR", "1PA": "PHE", "6V1": "CYS", "FGP": "SER", "BB9": "CYS", "AGT": "CYS", "CYG": "CYS", "VI3": "CYS",
        "PH6": "PRO", "NZH": "HIS", "DAB": "ALA", "B2A": "ALA", "6WK": "CYS", "PR4": "PRO", "7O5": "ALA", "OHS": "ASP",
        "3YM": "TYR", "Z3E": "THR", "NC1": "SER", "CAF": "CYS", "BPE": "CYS", "BB7": "CYS", "RE0": "TRP", "TSQ": "PHE",
        "4CY": "MET", "G5G": "LEU", "TDD": "LEU", "KCX": "LYS", "0AR": "ARG", "HSV": "HIS", "2ML": "LEU", "4PH": "PHE",
        "V44": "CYS", "IAS": "ASP", "FH7": "LYS", "PTM": "TYR", "SAR": "GLY", "SVX": "SER", "MEN": "ASN", "CS1": "CYS",
        "HOO": "HIS", "NYB": "CYS", "HMR": "ARG", "05N": "PRO", "V61": "PHE", "41H": "PHE", "BMT": "THR", "4HL": "TYR",
        "I2M": "ILE", "4N8": "PRO", "2RX": "SER", "CS3": "CYS", "MEA": "PHE", "B2F": "PHE", "CYF": "CYS", "GNC": "GLN",
        "4HJ": "SER", "CSJ": "CYS", "2SO": "HIS", "Q2E": "TRP", "CXM": "MET", "4WQ": "ALA", "5OW": "LYS", "TRX": "TRP",
        "B3Y": "TYR", "DAH": "PHE", "5PG": "GLY", "ESC": "MET", "DTY": "TYR", "CGA": "GLU", "TFW": "TRP", "SMF": "PHE",
        "S1H": "SER", "SAC": "SER", "QCI": "GLN", "CMT": "CYS", "TY2": "TYR", "0A8": "CYS", "OMH": "SER", "QPA": "CYS",
        "MK8": "LEU", "DLE": "LEU", "T0I": "TYR", "ALT": "ALA", "3X9": "CYS", "5CW": "TRP", "9E7": "LYS", "MGN": "GLN",
        "PBF": "PHE", "AEI": "THR", "TYI": "TYR", "SNN": "ASN", "74P": "LYS", "OHI": "HIS", "KST": "LYS", "SBL": "SER",
        "JJJ": "CYS", "JJL": "CYS", "2RA": "ALA", "DIL": "ILE", "02Y": "ALA", "CYJ": "LYS", "2HF": "HIS", "FC0": "PHE",
        "NLN": "LEU", "XW1": "ALA", "QMM": "GLN", "TOQ": "TRP", "WPA": "PHE", "TIH": "ALA", "NLB": "LEU", "BG1": "SER",
        "PTR": "TYR", "0WZ": "TYR", "ZYJ": "PRO", "SNC": "CYS", "BBC": "CYS", "B3E": "GLU", "4GJ": "CYS", "MSA": "GLY",
        "TPO": "THR", "HIQ": "HIS", "PHA": "PHE", "THC": "THR", "JJK": "CYS", "API": "LYS", "TY5": "TYR", "LPD": "PRO",
        "MND": "ASN", "PRV": "GLY", "M3L": "LYS", "HR7": "ARG", "86N": "GLU", "DSN": "SER", "5R5": "SER", "IC0": "GLY",
        "ARM": "ARG", "4AK": "LYS", "HT7": "TRP", "E9M": "TRP", "4DP": "TRP", "IML": "ILE", "BCS": "CYS", "7OZ": "ALA",
        "2MT": "PRO", "GLZ": "GLY", "0E5": "THR", "U3X": "PHE", "HYP": "PRO", "M0H": "CYS", "7XC": "PHE", "AZK": "LYS",
        "AHB": "ASN", "NCB": "ALA", "ASA": "ASP", "TPL": "TRP", "0TD": "ASP", "HTI": "CYS", "LRK": "LYS", "ME0": "MET",
        "143": "CYS", "FY2": "TYR", "1TY": "TYR", "QPH": "PHE", "F2F": "PHE", "3PX": "PRO", "PLJ": "PRO", "N9P": "ALA",
        "3ZH": "HIS", "C5C": "CYS", "PFF": "PHE", "NEP": "HIS", "CSA": "CYS", "4J4": "CYS", "O7G": "VAL", "TTS": "TYR",
        "KFP": "LYS", "FZN": "LYS", "TYN": "TYR", "AA4": "ALA", "LYX": "LYS", "HP9": "PHE", "TH5": "THR", "D2T": "ASP",
        "MED": "MET", "TRW": "TRP", "HLU": "LEU", "CSO": "CYS", "23F": "PHE", "PG9": "GLY", "EJA": "CYS", "RE3": "TRP",
        "66D": "ILE", "4OG": "TRP", "MSE": "MET", "MDF": "TYR", "DBU": "THR", "SEN": "SER", "Y57": "LYS", "XA6": "PHE",
        "M2S": "MET", "FLT": "TYR", "GME": "GLU", "LE1": "VAL", "FY3": "TYR", "OZW": "PHE", "FP9": "PRO", "FHL": "LYS",
        "MLE": "LEU", "DAR": "ARG", "BHD": "ASP", "LA2": "LYS", "SLZ": "LYS", "CSX": "CYS", "OCS": "CYS", "DMH": "ASN",
        "2CO": "CYS", "NLE": "LEU", "LME": "GLU", "HIC": "HIS", "ZBZ": "CYS", "MYK": "LYS", "2JG": "SER", "ORN": "ALA",
        "YTF": "GLN", "1AC": "ALA", "OLD": "HIS", "B2I": "ILE", "HZP": "PRO", "4AF": "PHE", "OMT": "MET", "CSP": "CYS",
        "APK": "LYS", "DPR": "PRO", "CY0": "CYS", "5T3": "LYS", "CY3": "CYS", "3GL": "GLU", "4II": "PHE", "0AK": "ASP",
        "ALC": "ALA", "LP6": "LYS", "HIP": "HIS", "60F": "CYS", "CML": "CYS", "CYQ": "CYS", "NA8": "ALA", "MH6": "SER",
        "GFT": "SER", "WLU": "LEU", "AZH": "ALA", "KBE": "LYS", "LCK": "LYS", "LAY": "LEU", "0LF": "PRO", "KKD": "ASP",
        "K7K": "SER", "CSR": "CYS", "B3K": "LYS", "OSE": "SER", "F2Y": "TYR", "NMM": "ARG", "P1L": "CYS", "PRS": "PRO",
        "OBS": "LYS", "ZDJ": "TYR", "BYR": "TYR", "HY3": "PRO", "ASB": "ASP", "NLY": "GLY", "0A1": "TYR", "DPL": "PRO",
        "SCS": "CYS", "I4G": "GLY", "6CV": "ALA", "HIA": "HIS", "LYN": "LYS", "54C": "TRP", "FGA": "GLU", "B27": "THR",
        "TYE": "TYR", "DTH": "THR", "PSH": "HIS", "EXA": "LYS", "BLE": "LEU", "P9S": "CYS", "23P": "ALA", "1TQ": "TRP",
        "RVJ": "ALA", "ALO": "THR", "FL6": "ASP", "4LZ": "TYR", "TMD": "THR", "FHO": "LYS", "0FL": "ALA", "AN6": "LEU",
        "4OV": "SER", "432": "SER", "SCH": "CYS", "DGL": "GLU", "2TL": "THR", "TPQ": "TYR", "3AH": "HIS", "CSD": "CYS",
        "PR3": "CYS", "IZO": "MET", "DV9": "GLU", "41Q": "ASN", "DI7": "TYR", "34E": "VAL", "MHS": "HIS", "GGL": "GLU",
        "ALY": "LYS", "O6H": "TRP", "8JB": "CYS", "SVV": "SER", "KOR": "MET", "PYX": "CYS", "6CL": "LYS", "WRP": "TRP",
        "SCY": "CYS", "G1X": "TYR", "2KK": "LYS", "TYQ": "TYR", "MIR": "SER", "ALN": "ALA", "CMH": "CYS", "KPY": "LYS",
        "SVZ": "SER", "NMC": "GLY", "RGL": "ARG", "SME": "MET", "DAL": "ALA", "DTR": "TRP", "PEC": "CYS", "SGB": "SER",
        "NLO": "LEU", "AHP": "ALA", "SLL": "LYS", "TRF": "TRP", "CME": "CYS", "SEE": "SER", "MME": "MET", "DYA": "ASP",
        "33X": "ALA", "LYF": "LYS", "CZ2": "CYS", "TRO": "TRP", "DPN": "PHE", "IB9": "TYR", "POK": "ARG", "LET": "LYS",
        "CCS": "CYS", "DGN": "GLN", "NIY": "TYR", "E9C": "TYR", "SEB": "SER", "AIB": "ALA", "OAS": "SER", "V7T": "LYS",
        "K5L": "SER", "TYS": "TYR", "FIO": "ARG", "B2V": "VAL", "GLJ": "GLU", "JLP": "LYS", "MVA": "VAL", "0Y8": "PRO",
        "OTH": "THR", "00C": "CYS", "0EA": "TYR", "F7W": "TRP", "LEI": "VAL", "UMA": "ALA", "OLT": "THR", "4KY": "PRO",
        "MCS": "CYS", "TNQ": "TRP", "HIX": "ALA", "C1X": "LYS", "PAT": "TRP", "T8L": "THR", "DM0": "LYS", "CG6": "CYS",
        "KPF": "LYS", "DYS": "CYS", "BB6": "CYS", "LAL": "ALA", "DLY": "LYS", "DJD": "PHE", "LTU": "TRP", "TYT": "TYR",
        "VPV": "LYS", "D11": "THR", "LEF": "LEU", "1X6": "SER", "ML3": "LYS", "MAA": "ALA", "7ID": "ASP", "AAR": "ARG",
        "NZC": "THR", "R1A": "CYS", "CGV": "CYS", "D3P": "GLY", "TIS": "SER", "LYR": "LYS", "4IN": "TRP", "CY4": "CYS",
        "0AF": "TRP", "TLY": "LYS", "SVA": "SER", "4HH": "SER", "HQA": "ALA", "PHD": "ASP", "KYN": "TRP", "4FW": "TRP",
        "VHF": "GLU", "CTH": "THR", "B3X": "ASN", "MTY": "TYR", "MLY": "LYS", "SMC": "CYS", "TS9": "ILE", "PXU": "PRO",
        "DSE": "SER", "P3Q": "TYR", "BCX": "CYS", "FAK": "LYS", "SVY": "SER", "CSS": "CYS", "FDL": "LYS", "2LT": "TYR",
        "N80": "PRO", "B3A": "ALA", "LYO": "LYS", "VR0": "ARG", "YTH": "THR",
    };

    // Constructor -------------------------------------------------------------
    constructor(nameThree) {

        // Case: invalid input name
        if (nameThree.length !== 3) {
            throw new Error('ERROR in AminoAcid(): Input must be a 3-letter amino acid code.');
        }

        // Uniformize name
        nameThree = nameThree.toUpperCase();

        // Case: Standard AA
        if (nameThree in AminoAcid.STANDARD_AAS_MAP) {
            const aminoAcidValues = AminoAcid.STANDARD_AAS_MAP[nameThree];
            this.id = aminoAcidValues.id;
            this.one = aminoAcidValues.one;
            this.three_standardized = nameThree;
            this.three = nameThree;
            this.name = aminoAcidValues.name;
            return;
        }

        // Case: Non-standard AA
        if (nameThree in AminoAcid.NON_STANDARD_AAS_MAP) {
            const nameThreeStandardized = AminoAcid.NON_STANDARD_AAS_MAP[nameThree];
            const aminoAcidValues = AminoAcid.STANDARD_AAS_MAP[nameThreeStandardized];
            this.id = aminoAcidValues.id;
            this.one = aminoAcidValues.one;
            this.three_standardized = nameThreeStandardized;
            this.three = nameThree;
            this.name = aminoAcidValues.name;
            return;
        }

        // Case: fallback for unknown amino acids
        this.id = 0;
        this.one = "X";
        this.three_standardized = "XXX";
        this.three = nameThree;
        this.name = "unknown";
    }

    // Methods -----------------------------------------------------------------
    
    static getAll() {
        // Get all 20 standard proteogenic Amino Acids
        return AminoAcid.STANDARD_AAS.map(aa_value => {
            return new AminoAcid(aa_value.three);
        });
    }

    isStandard() {
        return this.three_standardized == this.three;
    }

    isAminoAcid() {
        return this.id != 0;
    }

    toString() {
        return `AminoAcid('${this.three}')`;
    }

}
