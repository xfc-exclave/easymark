import { connect } from "react-redux";
import MilkEditor from "../../views/MilkEditor";
import { addEditor } from "../../redux/actions/editor";

export default connect((state) => ({ data: state }), { addEditor })(MilkEditor);