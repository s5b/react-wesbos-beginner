import React from 'react';

import Header from './Header';
import Order from './Order';
import Inventory from './Inventory';
import Fish from './Fish';

import base from '../base';

import sampleFishes from '../sample-fishes';

class App extends React.Component {

    constructor() {
        super();

        // Make the custom methods available on the instance with 'this' bound appropriately.
        this.addFish = this.addFish.bind(this);
        this.loadSamples = this.loadSamples.bind(this);
        this.addToOrder = this.addToOrder.bind(this);
        this.removeFromOrder = this.removeFromOrder.bind(this);
        this.updateFish = this.updateFish.bind(this);
        this.removeFish = this.removeFish.bind(this);

        this.state = {
            fishes: {},
            order: {}
        };
    }

    // Part of the React Component set of methods (part of component lifecycle management).
    // This runs right before the <App> is rendered.
    componentWillMount() {
        this.ref = base.syncState(`${this.props.params.storeId}/fishes`, { context: this, state: 'fishes' });

        const localStorageRef = localStorage.getItem(`order-${this.props.params.storeId}`);
        if (localStorageRef) {
            this.setState({ order: JSON.parse(localStorageRef) });
        }
    }

    // Part of the React Component set of methods (part of component lifecycle management).
    componentWillUnmount() {
        base.removeBinding(this.ref);
    }

    // Part of the React Component set of methods (part of component lifecycle management).
    componentWillUpdate(nextProps, nextState) {
        localStorage.setItem(`order-${this.props.params.storeId}`, JSON.stringify(nextState.order));
    }

    addFish(fish) {
        // Update the state.
        // Take a copy of the state, for performance and to avoid race conditions.
        const fishes = {...this.state.fishes};
        // Add in the new fish.
        const timestamp = Date.now();
        fishes[`fish-${timestamp}`] = fish;
        // Set the state.
        this.setState({ fishes })
    }

    updateFish(key, updatedFish) {
        const fishes = {...this.state.fishes};
        fishes[key] = updatedFish;
        this.setState({ fishes });
    }

    removeFish(key) {
        const fishes = {...this.state.fishes};
        // As a limitation with Friebase, we can't just delete the element. Instead we must set it to null.
        fishes[key] = null;
        this.setState({ fishes });
    }

    loadSamples() {
        this.setState({
            fishes: sampleFishes
        });
    }

    addToOrder(key) {
        const order = {...this.state.order};
        order[key] = order[key] + 1 || 1;
        this.setState({order});
    }

    removeFromOrder(key) {
        const order = {...this.state.order};
        // In this case we can just delete the element because Firebase isn't involved.
        delete order[key];
        this.setState({ order });
    }

    // Part of the React Component set of methods.
    render() {
        return (
            <div className="catch-of-the-day">
                <div className="menu">
                    <Header tagline="Fresh Seafood Market"/>
                    <ul className="list-of-fishes">
                        {
                            Object
                                .keys(this.state.fishes)
                                .map(key => <Fish key={key} index={key} details={this.state.fishes[key]} addToOrder={this.addToOrder}/>)
                        }
                    </ul>
                </div>
                <Order fishes={this.state.fishes} order={this.state.order} removeFromOrder={this.removeFromOrder}/>
                <Inventory loadSamples={this.loadSamples} fishes={this.state.fishes} addFish={this.addFish} updateFish={this.updateFish} removeFish={this.removeFish}/>
            </div>
        );
    }

}

App.propTypes = {
    params: React.PropTypes.object.isRequired
};

export default App;