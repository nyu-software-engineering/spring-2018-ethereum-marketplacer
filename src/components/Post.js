import React, {Component} from 'react'
import '../css/Post.css';

let savePostOnIpfs = (blob, ipfs) => {
    return new Promise(function (resolve, reject) {
        const descBuffer = Buffer.from(blob, 'utf-8');
        ipfs.add(descBuffer).then((response) => {
            // console.log("savePostOnIpfs() response: " + response[0].toString());
            resolve(response[0].hash);
        }).catch((err) => {
            console.error(err);
            reject(err);
        })
    })
};

class Post extends Component {


    constructor(props) {
        super(props);

        this.state = {
            count: null,
            blockChainHash: null,
            web3: null,
            address: null,
            strHash: null,
            isWriteSuccess: false
        }
    }

    handleSubmit = (event) => {
        event.preventDefault();
        const e = event.nativeEvent;
        const questionContent = e.target[0].value;
        const additionalDetails = e.target[1].value;
        const bountyAmount = e.target[2].value;
        console.log("questionContent: " + questionContent);
        console.log("additionalDetails: " + additionalDetails);
        console.log("bountyAmount: " + bountyAmount);

        console.log("props.ipfs: " + this.props.ipfs);
        console.log(this.props.web3);
        console.log(this.props.acct);

        const ipfsLocal = this.props.ipfs;

        // check bounty amount valid
        // check that bountyAmount <= amount in MetaMask wallet

        savePostOnIpfs(questionContent, ipfsLocal).then((hash) => {
            console.log('The question is now on IPFS');
            console.log(hash);
            this.setState({strHash: hash});
            console.log("strHash: " + this.state.strHash);
            this.props.contractInstance.submitQuestion(this.state.strHash, {from: this.props.userAccount}).then(() => {
                console.log("The question is now on the blockchain");
                // Get the number of posts... not working, 3/16
                this.props.contractInstance.getQuestionCount({from: this.props.userAccount}).then((data) => {
                    console.log("count updated to: " + data.toNumber());
                    this.setState({count: data.toNumber()});
                });
            });
        });
    };




    renderPostQuestionForm() {
        return (
            <div className="Post-form-container">
                <h2> Post a new question</h2>

                <form className="Post-form" onSubmit={this.handleSubmit}>
                    <label> Title </label>
                    <input type="text" title="title"
                           placeholder="What's your question? Be specific. "/><br/>

                    <label> Text (Optional) </label>
                    <textarea type="text"
                              title="content"
                              placeholder="Provide all the necessary details for someone to answer."></textarea><br/>

                    <label> Bounty (optional) </label>
                    <input type="text" title="bountyAmount"
                           placeholder="Attach a bounty to incentivize your question to be answered."/><br/>

                    <button>Submit Question</button>
                </form>
            </div>
        )
    }

    render() {
        return (
            <div className="App">
                {this.renderPostQuestionForm()}
            </div>
        );
    }
}

export default Post