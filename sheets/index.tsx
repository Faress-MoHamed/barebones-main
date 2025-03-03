import {
	registerSheet,
	type SheetDefinition,
} from "react-native-actions-sheet";
import MoreActionSheet from "./more.sheet";
import PetRecordSheet from "./PetRecordSheet";

console.log("Registering moreSheet...");

registerSheet("moreSheet", MoreActionSheet);
registerSheet("petSheet", PetRecordSheet);
// We extend some of the types here to give us great intellisense
// across the app for all registered sheets.
declare module "react-native-actions-sheet" {
	interface Sheets {
		moreSheet: SheetDefinition<{
			payload: {
				handleDelete?: any;
			};
		}>;
		petSheet: SheetDefinition;
	}
}

export {};
