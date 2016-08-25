//import $pnp from "sp-pnp-js";
//import moment from "moment";

export default class <%= safeName%> {
    /*
     * Helper to log informaiton to the console safely
     */
    logToConsole(msg) {
		if (window.console) {
			try { console.log(msg); }
			catch(e) { }
		}
    }

    test() {
        this.logToConsole("<%= safeName%> loads!")
    }
}
