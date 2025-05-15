

// Main ------------------------------------------------------------------------
export async function fetch_pdb(pdb_id) {

    // PDB ID test
    if (!isValidPDBId(pdb_id)) {
        throw new Error(`ERROR in LittleProtein::fetch_pdb('${pdb_id}'): invalid PDB ID.`);
    }

    // Generate url
    const pdb_id_upper = pdb_id.toUpperCase();
    const url = `https://files.rcsb.org/download/${pdb_id_upper}.pdb`;

    // Fetch
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`ERROR in LittleProtein::fetch_pdb('${pdb_id}'): HTTP error ${response.status}.`);
    }
    const pdb_str = await response.text();
    if (typeof(pdb_str) != "string") {
        throw new Error(`ERROR in LittleProtein::fetch_pdb('${pdb_id}'): output failed to convert to string (${pdb_str}).`);
    }

    // Return
    return pdb_str;

}

export async function fetch_uniprot(uniprot_id) {

    // PDB ID test
    if (!isValidUniprotId(uniprot_id)) {
        throw new Error(`ERROR in LittleProtein::fetch_uniprot('${uniprot_id}'): invalid UniProt ID.`);
    }

    // Generate url
    const uniprot_id_upper = uniprot_id.toUpperCase();
    const url = `https://alphafold.ebi.ac.uk/files/AF-${uniprot_id_upper}-F1-model_v4.pdb`

    // Fetch
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`ERROR in LittleProtein::fetch_uniprot('${uniprot_id}'): HTTP error ${response.status}.`);
    }
    const pdb_str = await response.text();
    if (typeof(pdb_str) != "string") {
        throw new Error(`ERROR in LittleProtein::fetch_uniprot('${uniprot_id}'): output failed to convert to string (${pdb_str}).`);
    }

    // Return
    return pdb_str;

}


// Dependencies ----------------------------------------------------------------
function isValidPDBId(pdb_id){

    // Init
    const POSSIBLE_FIRST_CHARACTERS = "123456789";
    const POSSIBLE_FOLLOWING_CHARACTERS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    // Base tests
    if (typeof(pdb_id) !== "string") return false;
    if (pdb_id.length !== 4) return false;

    // Characters tests
    const pdb_id_upper = pdb_id.toUpperCase();
    return POSSIBLE_FIRST_CHARACTERS.includes(pdb_id_upper[0]) &&
        [...pdb_id_upper.slice(1)].every(
            char => POSSIBLE_FOLLOWING_CHARACTERS.includes(char)
        );
}

function isValidUniprotId(uniprot_id){

    // Init
    const POSSIBLE_FIRST_CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const POSSIBLE_FOLLOWING_CHARACTERS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    // Base tests
    if (typeof(uniprot_id) !== "string") return false;
    if (uniprot_id.length < 6 || uniprot_id.length > 12) return false;

    // Characters tests
    const uniprot_id_upper = uniprot_id.toUpperCase();
    return POSSIBLE_FIRST_CHARACTERS.includes(uniprot_id_upper[0]) &&
        [...uniprot_id_upper.slice(1)].every(
            char => POSSIBLE_FOLLOWING_CHARACTERS.includes(char)
        );
}
