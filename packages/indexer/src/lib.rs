extern crate alloc;
use fuel_indexer_macros::indexer;
use fuel_indexer_plugin::prelude::*;

#[indexer(manifest = "indexer.manifest.yaml")]
pub mod explorer_index {
    use serde_json::Value;

    fn index_transaction(block_data: BlockData) {
        for tx in block_data.transactions.iter() {
            // let mut from: Option<&Address> = None;
            // let mut to: Option<&Address> = None;

            // Logger::info(format!("{:?}", &tx.transaction).as_str());

            match &tx.transaction {
                Transaction::Script(data) => {
                    // Logger::info(
                    //     format!(
                    //         "(>^‿^)> Inside a script transaction {:?}.",
                    //         block_data.height
                    //     )
                    //     .as_str(),
                    // );

                    // let output: Value = serde_json::from_str(t.outputs());
                    let inputs: Value = serde_json::from_str(data.inputs());
                    // let status: Value = serde_json::from_str(tx.status.clone());

                    TransactionEntity {
                        id: first8_bytes_to_u64(tx.id),
                        // status: Some(status),
                        age: block_data.time,
                        inputs: Some(inputs),
                        outputs: Json(serde_json::to_value(data.outputs()).unwrap().to_string()),
                    }
                    .save();
                }
                Transaction::Create(data) => {
                    // Logger::info(
                    //     format!(
                    //         "<(^.^)> Inside a create transaction {:?}.",
                    //         block_data.height
                    //     )
                    //     .as_str(),
                    // );
                    
                    let inputs: Value = serde_json::from_str(data.inputs());
                    // let status: Value = serde_json::from_str(tx.status.clone());

                    TransactionEntity {
                        id: first8_bytes_to_u64(tx.id),
                        // status: Some(status),
                        age: block_data.time,
                        inputs: Some(inputs),
                        outputs: Json(serde_json::to_value(data.outputs()).unwrap().to_string()),
                    }
                    .save();
                }
                Transaction::Mint(data) => {
                    // Logger::info(
                    //     format!("<(^‿^<) Inside a mint transaction {:?}.", block_data.height)
                    //         .as_str(),
                    // );

                    TransactionEntity {
                        id: first8_bytes_to_u64(tx.id),
                        // status: None,
                        age: block_data.time,
                        inputs: None,
                        outputs: Json(serde_json::to_value(data.outputs()).unwrap().to_string()),
                    }
                    .save();
                }
            }
        }
    }
}
