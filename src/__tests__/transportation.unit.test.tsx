import React from "react";
import { shallow, mount, render } from 'enzyme';
import { Provider } from "react-redux";
import store from "../store";
import sinon from "sinon";
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { Transportation } from "../Transportation/Transportation";
import { TRANSPORTATION_STATUS, STATUS, TRANSPORTATION_BUS_ROUTES } from "../constants";
import lolex from "lolex";
import TransportationExpired from "../Transportation/TransportationExpired";

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

const deadline = "2048-11-28T04:39:47.512Z";
const deadlineTooLate = "2048-11-28T05:39:47.512Z";

const schemas = { application_info: { schema: {}, uiSchema: {} }, transportation: { schema: {}, uiSchema: {} } };

const commonProps = {
    page: 0,
    formData: {},
    formName: "",
    incomingFormName: "",
    userEdited: false,
    schemas: schemas
}

it('no reimbursement before submitting form', () => {

    const profile = {
        status: STATUS.INCOMPLETE,
        type: "oos",
        admin_info: {
        },
        applications: [],
        transportation_status: null,
        forms: {}
    };
    const wrapper = render(
        <Transportation
            profile={profile} {...commonProps}
        />
    );
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.text()).toContain("There are no travel options at this time.");
});


it('no reimbursement', () => {

    const profile = {
        status: STATUS.ADMISSION_CONFIRMED,
        type: "oos",
        admin_info: {
        },
        applications: [],
        transportation_status: TRANSPORTATION_STATUS.UNAVAILABLE,
        forms: {}
    };
    const wrapper = render(
        <Transportation
            profile={profile} {...commonProps}
        />
    );
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.text()).toContain("You have not been given a travel reimbursement");
});

it('reimbursement screen when admission not yet confirmed', () => {

    const profile = {
        status: STATUS.ADMITTED,
        type: "oos",
        admin_info: {
            transportation: {
                type: "flight",
                amount: 500.30,
                deadline
            }
        },
        applications: [],
        transportation_status: TRANSPORTATION_STATUS.AVAILABLE,
        forms: {}
    };
    const wrapper = render(
        <Transportation
            profile={profile} {...commonProps}
        />
    );
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.text()).toContain("You have received a flight reimbursement");
    expect(wrapper.text()).toContain("After you confirm your spot using the dashboard, you can use this page to upload your receipts and request reimbursement");
});

it('flight reimbursement', () => {

    const profile = {
        status: STATUS.ADMISSION_CONFIRMED,
        type: "oos",
        admin_info: {
            transportation: {
                type: "flight",
                amount: 500.30,
                deadline
            }
        },
        applications: [],
        transportation_status: TRANSPORTATION_STATUS.AVAILABLE,
        forms: {}
    };
    const wrapper = render(
        <Transportation
            profile={profile} {...commonProps}
        />
    );
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.text()).toContain("You have received a flight reimbursement!");
    expect(wrapper.text()).toContain("$500.30");
});

it('bus reimbursement', () => {

    const profile = {
        status: STATUS.ADMISSION_CONFIRMED,
        type: "oos",
        admin_info: {
            transportation: {
                type: "bus",
                id: TRANSPORTATION_BUS_ROUTES.TEST,
                deadline
            }
        },
        applications: [],
        transportation_status: TRANSPORTATION_STATUS.AVAILABLE,
        forms: {}
    };
    const wrapper = render(
        <Transportation
            profile={profile} {...commonProps}
        />
    );
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.text()).toContain("Your bus coordinator is Tree Hack (treehack@treehacks.com)");
    expect(wrapper.text()).toContain("You have been placed on a bus!");
    expect(wrapper.text()).toContain("Hack, hack, hack!");
    expect(wrapper.text()).toContain("37th & McClintock");
});

it('bus reimbursement route with no coordinator', () => {

    const profile = {
        status: STATUS.ADMISSION_CONFIRMED,
        type: "oos",
        admin_info: {
            transportation: {
                type: "bus",
                id: TRANSPORTATION_BUS_ROUTES.TEST_NO_COORDINATOR,
                deadline
            }
        },
        applications: [],
        transportation_status: TRANSPORTATION_STATUS.AVAILABLE,
        forms: {}
    };
    const wrapper = render(
        <Transportation
            profile={profile} {...commonProps}
        />
    );
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.text()).toContain("We will add information for your bus coordinator");
    expect(wrapper.text()).toContain("You have been placed on a bus!");
    expect(wrapper.text()).toContain("Hack, hack, hack!");
    expect(wrapper.text()).toContain("37th & McClintock");
});

it('other reimbursement', () => {

    const profile = {
        status: STATUS.ADMISSION_CONFIRMED,
        type: "oos",
        admin_info: {
            transportation: {
                type: "other",
                amount: 500.30,
                deadline
            }
        },
        applications: [],
        transportation_status: TRANSPORTATION_STATUS.AVAILABLE,
        forms: {}
    };
    const wrapper = render(
        <Transportation
            profile={profile} {...commonProps}
        />
    );
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.text()).toContain("You have received a travel reimbursement!");
    expect(wrapper.text()).toContain("$500.30");
});

it('bus reimbursement with accept=true', () => {

    const profile = {
        status: STATUS.ADMISSION_CONFIRMED,
        type: "oos",
        admin_info: {
            transportation: {
                type: "bus",
                id: TRANSPORTATION_BUS_ROUTES.TEST,
                deadline
            }
        },
        applications: [],
        transportation_status: TRANSPORTATION_STATUS.AVAILABLE,
        forms: {
        }
    };
    const wrapper = render(
        <Transportation
            profile={profile} {...commonProps} formData={{accept: true}}
        />
    );
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.text()).toContain("You have been placed on a bus!");
    expect(wrapper.text()).toContain("Hack, hack, hack!");
    expect(wrapper.text()).toContain("37th & McClintock");
    expect(wrapper.text()).toContain("We've received your RSVP! You can cancel your RSVP");
});

it('flight reimbursement with transportation_status=SUBMITTED', () => {

    const profile = {
        status: STATUS.ADMISSION_CONFIRMED,
        type: "oos",
        admin_info: {
            transportation: {
                type: "flight",
                amount: 500.30,
                deadline
            }
        },
        applications: [],
        transportation_status: TRANSPORTATION_STATUS.SUBMITTED,
        forms: {
        }
    };
    const wrapper = render(
        <Transportation
            profile={profile} {...commonProps} formData={{accept: true}}
        />
    );
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.text()).toContain("You have received a flight reimbursement!");
    expect(wrapper.text()).toContain("$500.30");
    expect(wrapper.text()).toContain("Thanks, we've received your receipt");
});

it('other reimbursement with transportation_status=SUBMITTED', () => {

    const profile = {
        status: STATUS.ADMISSION_CONFIRMED,
        type: "oos",
        admin_info: {
            transportation: {
                type: "other",
                amount: 500.30,
                deadline
            }
        },
        applications: [],
        transportation_status: TRANSPORTATION_STATUS.SUBMITTED,
        forms: {
        }
    };
    const wrapper = render(
        <Transportation
            profile={profile} {...commonProps} formData={{accept: true}}
        />
    );
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.text()).toContain("You have received a travel reimbursement!");
    expect(wrapper.text()).toContain("$500.30");
    expect(wrapper.text()).toContain("Thanks, we've received your reimbursement request");
});

it('flight reimbursement with deadline passed, should show expired screen', () => {

    const profile = {
        status: STATUS.ADMISSION_CONFIRMED,
        type: "oos",
        admin_info: {
            transportation: {
                type: "flight",
                amount: 500.30,
                deadline
            }
        },
        applications: [],
        transportation_status: TRANSPORTATION_STATUS.AVAILABLE,
        forms: {
        }
    };
    const clock = lolex.install({now: new Date(deadlineTooLate)});
    const wrapper = shallow(
        <Transportation
            profile={profile} {...commonProps}
        />
    );
    clock.uninstall();
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.contains(<TransportationExpired />)).toBe(true);
});

it('other reimbursement with deadline passed, should show deadline passed', () => {

    const profile = {
        status: STATUS.ADMISSION_CONFIRMED,
        type: "oos",
        admin_info: {
            transportation: {
                type: "other",
                amount: 500.30,
                deadline
            }
        },
        applications: [],
        transportation_status: TRANSPORTATION_STATUS.AVAILABLE,
        forms: {
        }
    };
    const clock = lolex.install({now: new Date(deadlineTooLate)});
    const wrapper = shallow(
        <Transportation
            profile={profile} {...commonProps}
        />
    );
    clock.uninstall();
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.contains(<TransportationExpired />)).toBe(true);
});

it('flight reimbursement with deadline passed, should not show expired message', () => {

    const profile = {
        status: STATUS.ADMISSION_CONFIRMED,
        type: "oos",
        admin_info: {
            transportation: {
                type: "flight",
                amount: 500.30,
                deadline
            }
        },
        applications: [],
        transportation_status: TRANSPORTATION_STATUS.SUBMITTED,
        forms: {
        }
    };
    const clock = lolex.install({now: new Date(deadlineTooLate)});
    const wrapper = shallow(
        <Transportation
            profile={profile} {...commonProps}
        />
    );
    clock.uninstall();
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.contains(<TransportationExpired />)).toBe(false);
});

it('other reimbursement with deadline passed, should not show expired message', () => {

    const profile = {
        status: STATUS.ADMISSION_CONFIRMED,
        type: "oos",
        admin_info: {
            transportation: {
                type: "other",
                amount: 500.30,
                deadline
            }
        },
        applications: [],
        transportation_status: TRANSPORTATION_STATUS.SUBMITTED,
        forms: {
        }
    };
    const clock = lolex.install({now: new Date(deadlineTooLate)});
    const wrapper = shallow(
        <Transportation
            profile={profile} {...commonProps}
        />
    );
    clock.uninstall();
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.contains(<TransportationExpired />)).toBe(false);
});


it('bus reimbursement with deadline passed and no RSVP, should show TransportationExpired', () => {

    const profile = {
        status: STATUS.ADMISSION_CONFIRMED,
        type: "oos",
        admin_info: {
            transportation: {
                type: "bus",
                id: TRANSPORTATION_BUS_ROUTES.TEST,
                deadline
            }
        },
        applications: [],
        transportation_status: TRANSPORTATION_STATUS.AVAILABLE,
        forms: {
        }
    };
    const clock = lolex.install({now: new Date(deadlineTooLate)});
    const wrapper = shallow(
        <Transportation
            profile={profile} {...commonProps} formData={{}}
        />
    );
    clock.uninstall();
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.contains(<TransportationExpired />)).toBe(true);
});

it('bus reimbursement with deadline passed and RSVP\'d yes, should show bus route', () => {

    const profile = {
        status: STATUS.ADMISSION_CONFIRMED,
        type: "oos",
        admin_info: {
            transportation: {
                type: "bus",
                id: TRANSPORTATION_BUS_ROUTES.TEST,
                deadline
            }
        },
        applications: [],
        transportation_status: TRANSPORTATION_STATUS.AVAILABLE,
        forms: {
            transportation: {
            }
        }
    };
    const clock = lolex.install({now: new Date(deadlineTooLate)});
    const wrapper = render(
        <Transportation
            profile={profile} {...commonProps} formData={{accept: true}}
        />
    );
    clock.uninstall();
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.text()).toContain("You have been placed on a bus!");
});

it('bus reimbursement with deadline passed and RSVP\'d no, should show TransportationExpired', () => {

    const profile = {
        status: STATUS.ADMISSION_CONFIRMED,
        type: "oos",
        admin_info: {
            transportation: {
                type: "bus",
                id: TRANSPORTATION_BUS_ROUTES.TEST,
                deadline
            }
        },
        applications: [],
        transportation_status: TRANSPORTATION_STATUS.AVAILABLE,
        forms: {
            transportation: {
            }
        }
    };
    const clock = lolex.install({now: new Date(deadlineTooLate)});
    const wrapper = shallow(
        <Transportation
            profile={profile} {...commonProps} formData={{accept: false}}
        />
    );
    clock.uninstall();
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.contains(<TransportationExpired />)).toBe(true);
});


it('don\'t show reimbursement if status is unavailable, even if reimbursement is defined', () => {

    const profile = {
        status: STATUS.ADMISSION_CONFIRMED,
        type: "oos",
        admin_info: {
            transportation: {
                type: "other",
                amount: 500.30,
                deadline
            }
        },
        applications: [],
        transportation_status: TRANSPORTATION_STATUS.UNAVAILABLE,
        forms: {}
    };
    const wrapper = render(
        <Transportation
            profile={profile} {...commonProps}
        />
    );
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.text()).toContain("You have not been given a travel reimbursement");
    expect(wrapper.text()).not.toContain("You have received a travel reimbursement!");
    expect(wrapper.text()).not.toContain("$500.30");
});


it('reimbursement screen when admission declined -- don\'t show reimbursement', () => {

    const profile = {
        status: STATUS.ADMISSION_DECLINED,
        type: "oos",
        admin_info: {
            transportation: {
                type: "other",
                amount: 500.30,
                deadline
            }
        },
        applications: [],
        transportation_status: TRANSPORTATION_STATUS.AVAILABLE,
        forms: {}
    };
    const wrapper = render(
        <Transportation
            profile={profile} {...commonProps}
        />
    );
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.text()).not.toContain("You have received a travel reimbursement!");
    expect(wrapper.text()).toContain("You have declined your admission, so no transportation options are available.");
    expect(wrapper.text()).not.toContain("$500.30");
});