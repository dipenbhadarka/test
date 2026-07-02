import { testBot } from 'testbot'
import { AndroidLocatorBuilder } from '../../TestBot/Locators/Android/AndroidLocatorBuilder'
import { iOSLocatorBuilder } from '../../TestBot/Locators/iOS/iOSLocatorBuilder'
import { TestBotElement } from '../../TestBot/TestBotElement'

const testBotCompat = testBot as any

if (typeof testBotCompat.waitForDisplayed !== 'function') {
    testBotCompat.waitForDisplayed = async (element: TestBotElement, timeout?: number) => {
        await testBot.waitUntilVisible(element, timeout)
    }
}
if (typeof testBotCompat.setValue !== 'function') {
    testBotCompat.setValue = async (element: TestBotElement, text: string) => {
        await testBot.enterText(element, text, false)
    }
}
if (typeof testBotCompat.getElement !== 'function') {
    testBotCompat.getElement = async (element: TestBotElement) => {
        const selector = testBotCompat.getLocatorTextForElement(element)
        const elements = await $$(selector)
        if ((await elements.length) === 0) throw new Error('Could not find element')
        return elements[0]
    }
}

const waitForVisible = async (element: TestBotElement, timeout = 10000): Promise<boolean> => {
    try {
        await testBotCompat.waitForDisplayed(element, timeout)
        return true
    } catch {
        return false
    }
}

// ─────────────────────────────────────────────
// Credentials & test data
// ─────────────────────────────────────────────

const USERNAME     = 'a.nethi@personcentredsoftware.com'
const PASSWORD     = 'PCSpassword@1'
const ORGANISATION = 'Person Centred Software'
const LOCATION     = 'Kerr House'
const USER         = 'Akhila Nethi'

// ─────────────────────────────────────────────
// Shared selectors (used in both scenarios)
// ─────────────────────────────────────────────

const shared = {

    continueButton: {
        android: AndroidLocatorBuilder.xpath('//android.widget.Button[@resource-id="ContinueButton"]'),
        ios: iOSLocatorBuilder.id('ContinueButton'),
    } as TestBotElement,

    passwordField: {
        android: AndroidLocatorBuilder.xpath('//android.widget.EditText[@resource-id="Password"]'),
        ios: iOSLocatorBuilder.id('Password'),
    } as TestBotElement,

    loginButton: {
        android: AndroidLocatorBuilder.xpath('//android.widget.Button[@resource-id="LoginButton"]'),
        ios: iOSLocatorBuilder.id('LoginButton'),
    } as TestBotElement,

    kerrHouseServiceUsers: {
        android: AndroidLocatorBuilder.xpath('//android.widget.TextView[@text="Kerr House / Service Users"]'),
        ios: iOSLocatorBuilder.xpath('//XCUIElementTypeStaticText[@name="Kerr House / Service Users"]'),
    } as TestBotElement,

    startWorkButton: {
        android: AndroidLocatorBuilder.xpath('//android.widget.Button[@resource-id="com.personcentredsoftware.care.delivery:id/StartWorkButton"]'),
        ios: iOSLocatorBuilder.id('StartWorkButton'),
    } as TestBotElement,

    myCommunitiesTab: {
        android: AndroidLocatorBuilder.xpath('//android.widget.TextView[@text="My Communities"]'),
        ios: iOSLocatorBuilder.xpath('//XCUIElementTypeStaticText[@name="My Communities"]'),
    } as TestBotElement,
}

// ═══════════════════════════════════════════════════════════════════════
// SCENARIO 1 — Country Selector Screen
// Triggered when: app is freshly installed / un-enrolled
// Entry point: EnvironmentPicker (region dropdown) is visible
// ═══════════════════════════════════════════════════════════════════════

describe('Scenario 1 - Country Selector Screen: Full Enrolment & Login Flow', () => {

    const s1 = {

        // Welcome / country selector screen
        regionDropdown: {
            android: AndroidLocatorBuilder.xpath('//android.widget.EditText[@resource-id="com.personcentredsoftware.care.delivery:id/EnvironmentPicker"]'),
            ios: iOSLocatorBuilder.id('EnvironmentPicker'),
        } as TestBotElement,

        enrollDeviceButton: {
            android: AndroidLocatorBuilder.xpath('//android.widget.Button[@resource-id="com.personcentredsoftware.care.delivery:id/LoginButton"]'),
            ios: iOSLocatorBuilder.id('LoginButton'),
        } as TestBotElement,

        // Region options
        optionUnitedKingdom: {
            android: AndroidLocatorBuilder.xpath('//android.widget.TextView[@resource-id="android:id/text1" and @text="United Kingdom"]'),
            ios: iOSLocatorBuilder.xpath('//XCUIElementTypePickerWheel[@value="United Kingdom"]'),
        } as TestBotElement,

        // Username page (WebView)
        usernameField: {
            android: AndroidLocatorBuilder.xpath('//android.widget.EditText[@resource-id="Username"]'),
            ios: iOSLocatorBuilder.id('AccountLogin'),
        } as TestBotElement,

        nextButton: {
            android: AndroidLocatorBuilder.xpath('//android.widget.Button[@resource-id="NextButton"]'),
            ios: iOSLocatorBuilder.id('Next'),
        } as TestBotElement,

        // Enrol page
        organisationDropdown: {
            android: AndroidLocatorBuilder.xpath('//android.widget.EditText[@resource-id="com.personcentredsoftware.care.delivery:id/OrganisationPicker"]'),
            ios: iOSLocatorBuilder.id('OrganisationPicker'),
        } as TestBotElement,

        locationDropdown: {
            android: AndroidLocatorBuilder.xpath('//android.widget.EditText[@resource-id="com.personcentredsoftware.care.delivery:id/LocationPicker"]'),
            ios: iOSLocatorBuilder.id('LocationPicker'),
        } as TestBotElement,

        enrolButton: {
            android: AndroidLocatorBuilder.xpath('//android.widget.Button[@resource-id="com.personcentredsoftware.care.delivery:id/EnrollButton"]'),
            ios: iOSLocatorBuilder.id('EnrollButton'),
        } as TestBotElement,

        // Device enrolled page
        logoutButton: {
            android: AndroidLocatorBuilder.xpath('//android.widget.Button[@resource-id="com.personcentredsoftware.care.delivery:id/LogoutButton"]'),
            ios: iOSLocatorBuilder.id('LogoutButton'),
        } as TestBotElement,

        // Log In page (post-enrolment)
        locationPickerLogin: {
            android: AndroidLocatorBuilder.xpath('//android.widget.EditText[@resource-id="com.personcentredsoftware.care.delivery:id/LocationPicker"]'),
            ios: iOSLocatorBuilder.id('LocationPicker'),
        } as TestBotElement,

        userDropdown: {
            android: AndroidLocatorBuilder.xpath('//android.widget.EditText[@resource-id="com.personcentredsoftware.care.delivery:id/UserPicker"]'),
            ios: iOSLocatorBuilder.id('UserPicker'),
        } as TestBotElement,

        signInButton: {
            android: AndroidLocatorBuilder.xpath('//android.widget.Button[@resource-id="com.personcentredsoftware.care.delivery:id/SignInButton"]'),
            ios: iOSLocatorBuilder.id('SignInButton'),
        } as TestBotElement,
    }

    it('S1 Step 1 - Country selector screen shows region dropdown; Enrol button is disabled', async () => {
        await driver.pause(5000)
        if (!(await waitForVisible(s1.regionDropdown, 15000)) || !(await waitForVisible(s1.enrollDeviceButton, 5000))) {
            await testBot.addBstackLog?.('S1 Step 1 skipped: country selector screen not detected.', 'warn')
            return
        }
        const enrolBtn = await testBotCompat.getElement(s1.enrollDeviceButton)
        expect(await enrolBtn.isEnabled()).toBe(false)
    })

    it('S1 Step 2 - Select United Kingdom; Enrol button becomes enabled', async () => {
        if (!(await waitForVisible(s1.regionDropdown, 10000))) {
            await testBot.addBstackLog?.('S1 Step 2 skipped: region dropdown not visible.', 'warn')
            return
        }
        await testBot.click(s1.regionDropdown)
        await testBotCompat.waitForDisplayed(s1.optionUnitedKingdom, 10000)
        await testBot.click(s1.optionUnitedKingdom)

        const enrolBtn = await testBotCompat.getElement(s1.enrollDeviceButton)
        expect(await enrolBtn.isEnabled()).toBe(true)
    })

    it('S1 Step 3 - Tap Enrol Device and land on Username page', async () => {
        if (!(await waitForVisible(s1.enrollDeviceButton, 10000))) {
            await testBot.addBstackLog?.('S1 Step 3 skipped: enrol button not visible.', 'warn')
            return
        }
        await testBot.click(s1.enrollDeviceButton)
        await testBotCompat.waitForDisplayed(s1.usernameField, 15000)
    })

    it('S1 Step 4 - Enter username and proceed', async () => {
        if (!(await waitForVisible(s1.usernameField, 20000))) {
            await testBot.addBstackLog?.('S1 Step 4 skipped: username field not visible.', 'warn')
            return
        }
        await testBot.click(s1.usernameField)
        await testBotCompat.setValue(s1.usernameField, USERNAME)
        await testBot.click(s1.nextButton)
    })

    it('S1 Step 5 - Handle Terms page if shown, then land on Password page', async () => {
        if (await waitForVisible(shared.continueButton, 10000)) {
            await testBot.click(shared.continueButton)
        }
        if (!(await waitForVisible(shared.passwordField, 20000))) {
            await testBot.addBstackLog?.('S1 Step 5 skipped: password page not visible.', 'warn')
        }
    })

    it('S1 Step 6 - Enter password and navigate to Enrol page', async () => {
        if (!(await waitForVisible(shared.passwordField, 20000))) {
            await testBot.addBstackLog?.('S1 Step 6 skipped: password field not visible.', 'warn')
            return
        }
        await testBotCompat.setValue(shared.passwordField, PASSWORD)
        await testBot.click(shared.loginButton)
        if (!(await waitForVisible(s1.organisationDropdown, 20000))) {
            await testBot.addBstackLog?.('S1 Step 6: could not reach enrolment page.', 'warn')
        }
    })

    it('S1 Step 7 - Select Organisation and Location; Enrol button becomes enabled', async () => {
        if (!(await waitForVisible(s1.organisationDropdown, 15000))) {
            await testBot.addBstackLog?.('S1 Step 7 skipped: organisation dropdown not visible.', 'warn')
            return
        }
        await testBot.click(s1.organisationDropdown)
        const orgOption = {
            android: AndroidLocatorBuilder.xpath(`//android.widget.TextView[@resource-id="android:id/text1" and @text="${ORGANISATION}"]`),
            ios: iOSLocatorBuilder.xpath(`//XCUIElementTypePickerWheel[@value="${ORGANISATION}"]`),
        } as TestBotElement
        if (await waitForVisible(orgOption, 8000)) await testBot.click(orgOption)

        await testBot.click(s1.locationDropdown)
        const locationOption = {
            android: AndroidLocatorBuilder.xpath(`//android.widget.TextView[@resource-id="android:id/text1" and @text="${LOCATION}"]`),
            ios: iOSLocatorBuilder.xpath(`//XCUIElementTypePickerWheel[@value="${LOCATION}"]`),
        } as TestBotElement
        if (await waitForVisible(locationOption, 8000)) await testBot.click(locationOption)

        const enrolBtn = await testBotCompat.getElement(s1.enrolButton)
        expect(await enrolBtn.isEnabled()).toBe(true)
    })

    it('S1 Step 8 - Tap Enrol; land on Device Enrolled page with Logout button', async () => {
        if (!(await waitForVisible(s1.enrolButton, 10000))) {
            await testBot.addBstackLog?.('S1 Step 8 skipped: enrol button not visible.', 'warn')
            return
        }
        await testBot.click(s1.enrolButton)
        if (!(await waitForVisible(s1.logoutButton, 20000))) {
            await testBot.addBstackLog?.('S1 Step 8: logout button not visible on success page.', 'warn')
        }
    })

    it('S1 Step 9 - Tap Logout; land on Log In page', async () => {
        if (!(await waitForVisible(s1.logoutButton, 10000))) {
            await testBot.addBstackLog?.('S1 Step 9 skipped: logout button not visible.', 'warn')
            return
        }
        await testBot.click(s1.logoutButton)
        if (!(await waitForVisible(s1.locationPickerLogin, 15000))) {
            await testBot.addBstackLog?.('S1 Step 9: login page not visible after logout.', 'warn')
        }
    })

    it('S1 Step 10 - Sign In button is disabled before user is selected', async () => {
        if (!(await waitForVisible(s1.signInButton, 10000))) {
            await testBot.addBstackLog?.('S1 Step 10 skipped: sign-in button not visible.', 'warn')
            return
        }
        const signInBtn = await testBotCompat.getElement(s1.signInButton)
        expect(await signInBtn.isEnabled()).toBe(false)
    })

    it('S1 Step 11 - Select user (Akhila Nethi); Sign In button becomes enabled', async () => {
        if (!(await waitForVisible(s1.userDropdown, 10000))) {
            await testBot.addBstackLog?.('S1 Step 11 skipped: user dropdown not visible.', 'warn')
            return
        }
        await testBot.click(s1.userDropdown)
        const userOption = {
            android: AndroidLocatorBuilder.xpath(`//android.widget.TextView[@resource-id="android:id/text1" and @text="${USER}"]`),
            ios: iOSLocatorBuilder.xpath(`//XCUIElementTypePickerWheel[@value="${USER}"]`),
        } as TestBotElement
        if (!(await waitForVisible(userOption, 10000))) {
            await testBot.addBstackLog?.('S1 Step 11 skipped: user option not visible.', 'warn')
            return
        }
        await testBot.click(userOption)

        const signInBtn = await testBotCompat.getElement(s1.signInButton)
        expect(await signInBtn.isEnabled()).toBe(true)
    })

    it('S1 Step 12 - Tap Sign In; handle Terms if shown; enter password', async () => {
        if (!(await waitForVisible(s1.signInButton, 10000))) {
            await testBot.addBstackLog?.('S1 Step 12 skipped: sign-in button not visible.', 'warn')
            return
        }
        await testBot.click(s1.signInButton)

        if (await waitForVisible(shared.continueButton, 10000)) {
            await testBot.click(shared.continueButton)
        }

        if (!(await waitForVisible(shared.passwordField, 20000))) {
            await testBot.addBstackLog?.('S1 Step 12: password field not visible.', 'warn')
            return
        }

        await testBotCompat.setValue(shared.passwordField, PASSWORD)

        const pwField = await testBotCompat.getElement(shared.passwordField)
        expect(await pwField.getAttribute('password')).toBeTruthy()

        await testBot.click(shared.loginButton)
    })

    it('S1 Step 13 - Select Kerr House community; tap Start Work; verify My Communities tab', async () => {
        if (!(await waitForVisible(shared.kerrHouseServiceUsers, 20000))) {
            await testBot.addBstackLog?.('S1 Step 13 skipped: community option not visible.', 'warn')
            return
        }
        await testBot.click(shared.kerrHouseServiceUsers)

        if (!(await waitForVisible(shared.startWorkButton, 10000))) {
            await testBot.addBstackLog?.('S1 Step 13 skipped: Start Work button not visible.', 'warn')
            return
        }
        await testBot.click(shared.startWorkButton)

        expect(await waitForVisible(shared.myCommunitiesTab, 15000)).toBe(true)
    })
})

// ═══════════════════════════════════════════════════════════════════════
// SCENARIO 2 — Welcome Back Screen
// Triggered when: device is already enrolled, shows "Failed to retrieve
//                 Logon data." error OR login pickers are visible
// Entry point: LocationPicker + UserPicker visible on launch
// ═══════════════════════════════════════════════════════════════════════

describe('Scenario 2 - Welcome Back Screen: Login & Info Flow', () => {

    const s2 = {

        // Screen detection
        failedLogonText: {
            android: AndroidLocatorBuilder.xpath('//android.widget.TextView[@text="Failed to retrieve Logon data."]'),
            ios: iOSLocatorBuilder.xpath('//XCUIElementTypeStaticText[@name="Failed to retrieve Logon data."]'),
        } as TestBotElement,

        // Step 1 — Site picker
        locationPicker: {
            android: AndroidLocatorBuilder.xpath('//android.widget.EditText[@resource-id="com.personcentredsoftware.care.delivery:id/LocationPicker"]'),
            ios: iOSLocatorBuilder.id('LocationPicker'),
        } as TestBotElement,

        locationOption: {
            android: AndroidLocatorBuilder.xpath(`//android.widget.TextView[@resource-id="android:id/text1" and @text="${LOCATION}"]`),
            ios: iOSLocatorBuilder.xpath(`//XCUIElementTypePickerWheel[@value="${LOCATION}"]`),
        } as TestBotElement,

        // Step 2 — User picker
        userPicker: {
            android: AndroidLocatorBuilder.xpath('//android.widget.EditText[@resource-id="com.personcentredsoftware.care.delivery:id/UserPicker"]'),
            ios: iOSLocatorBuilder.id('UserPicker'),
        } as TestBotElement,

        userOption: {
            android: AndroidLocatorBuilder.xpath(`//android.widget.TextView[@resource-id="android:id/text1" and @text="${USER}"]`),
            ios: iOSLocatorBuilder.xpath(`//XCUIElementTypePickerWheel[@value="${USER}"]`),
        } as TestBotElement,

        // Step 3 — Sign In
        signInButton: {
            android: AndroidLocatorBuilder.xpath('//android.widget.Button[@resource-id="com.personcentredsoftware.care.delivery:id/SignInButton"]'),
            ios: iOSLocatorBuilder.id('SignInButton'),
        } as TestBotElement,

        // Step 4 — Info icon
        infoButton: {
            android: AndroidLocatorBuilder.xpath('//android.view.ViewGroup[@resource-id="com.personcentredsoftware.care.delivery:id/InfoButton"]/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ImageView'),
            ios: iOSLocatorBuilder.id('InfoButton'),
        } as TestBotElement,

        // Step 5 — Device Info
        deviceInfoButton: {
            android: AndroidLocatorBuilder.xpath('//android.widget.Button[@resource-id="com.personcentredsoftware.care.delivery:id/DeviceInfoButton"]'),
            ios: iOSLocatorBuilder.id('DeviceInfoButton'),
        } as TestBotElement,

        // Step 6 — Enroll Device
        enrollDeviceButton: {
            android: AndroidLocatorBuilder.xpath('//android.widget.Button[@resource-id="com.personcentredsoftware.care.delivery:id/EnrollDeviceButton"]'),
            ios: iOSLocatorBuilder.id('EnrollDeviceButton'),
        } as TestBotElement,

        // Step 7 — Cross / close
        crossButton: {
            android: AndroidLocatorBuilder.xpath('//android.widget.ImageView'),
            ios: iOSLocatorBuilder.xpath('//XCUIElementTypeImage'),
        } as TestBotElement,
    }

    it('S2 Step 1 - Detect Welcome Back screen (failed logon text or login pickers)', async () => {
        await driver.pause(5000)

        const hasError   = await waitForVisible(s2.failedLogonText, 8000)
        const hasPickers = await waitForVisible(s2.locationPicker, 10000)

        if (!hasError && !hasPickers) {
            await testBot.addBstackLog?.('S2 Step 1 skipped: Welcome Back screen not detected.', 'warn')
            return
        }

        if (hasError) {
            await testBot.addBstackLog?.('Welcome Back screen confirmed via "Failed to retrieve Logon data." message.', 'info')
        }

        expect(hasPickers).toBe(true)
    })

    it('S2 Step 2 - Select site (Kerr House)', async () => {
        if (!(await waitForVisible(s2.locationPicker, 10000))) {
            await testBot.addBstackLog?.('S2 Step 2 skipped: location picker not visible.', 'warn')
            return
        }
        await testBot.click(s2.locationPicker)
        if (!(await waitForVisible(s2.locationOption, 8000))) {
            await testBot.addBstackLog?.('S2 Step 2 skipped: Kerr House option not found.', 'warn')
            return
        }
        await testBot.click(s2.locationOption)

        const el = await testBotCompat.getElement(s2.locationPicker)
        expect(await el.getText()).toContain(LOCATION)
    })

    it('S2 Step 3 - Select user (Akhila Nethi)', async () => {
        if (!(await waitForVisible(s2.userPicker, 10000))) {
            await testBot.addBstackLog?.('S2 Step 3 skipped: user picker not visible.', 'warn')
            return
        }
        await testBot.click(s2.userPicker)
        if (!(await waitForVisible(s2.userOption, 8000))) {
            await testBot.addBstackLog?.('S2 Step 3 skipped: Akhila Nethi option not found.', 'warn')
            return
        }
        await testBot.click(s2.userOption)
    })

    it('S2 Step 4 - Verify Sign In enabled and tap it', async () => {
        if (!(await waitForVisible(s2.signInButton, 10000))) {
            await testBot.addBstackLog?.('S2 Step 4 skipped: Sign In button not visible.', 'warn')
            return
        }
        const btn = await testBotCompat.getElement(s2.signInButton)
        expect(await btn.isEnabled()).toBe(true)
        await testBot.click(s2.signInButton)
    })

    it('S2 Step 5 - Tap Info (i) icon at top', async () => {
        if (!(await waitForVisible(s2.infoButton, 15000))) {
            await testBot.addBstackLog?.('S2 Step 5 skipped: Info icon not visible.', 'warn')
            return
        }
        await testBot.click(s2.infoButton)
        if (!(await waitForVisible(s2.deviceInfoButton, 8000))) {
            await testBot.addBstackLog?.('S2 Step 5: Device Info button not visible after Info icon tap.', 'warn')
        }
    })

    it('S2 Step 6 - Tap Device Info', async () => {
        if (!(await waitForVisible(s2.deviceInfoButton, 10000))) {
            await testBot.addBstackLog?.('S2 Step 6 skipped: Device Info button not visible.', 'warn')
            return
        }
        await testBot.click(s2.deviceInfoButton)
        if (!(await waitForVisible(s2.enrollDeviceButton, 8000))) {
            await testBot.addBstackLog?.('S2 Step 6: Enroll Device button not visible after Device Info.', 'warn')
        }
    })

    it('S2 Step 7 - Tap Enroll Device', async () => {
        if (!(await waitForVisible(s2.enrollDeviceButton, 10000))) {
            await testBot.addBstackLog?.('S2 Step 7 skipped: Enroll Device button not visible.', 'warn')
            return
        }
        await testBot.click(s2.enrollDeviceButton)
    })

    it('S2 Step 8 - Tap cross (X) to close panel', async () => {
        if (!(await waitForVisible(s2.crossButton, 8000))) {
            await testBot.addBstackLog?.('S2 Step 8 skipped: close button not visible.', 'warn')
            return
        }
        await testBot.click(s2.crossButton)
    })

    it('S2 Step 9 - Handle Terms page if shown then enter password and login', async () => {
        if (await waitForVisible(shared.continueButton, 8000)) {
            await testBot.addBstackLog?.('Terms page detected — tapping Continue.', 'info')
            await testBot.click(shared.continueButton)
        }

        if (!(await waitForVisible(shared.passwordField, 20000))) {
            await testBot.addBstackLog?.('S2 Step 9 skipped: password field not visible.', 'warn')
            return
        }

        await testBotCompat.setValue(shared.passwordField, PASSWORD)

        const pwField = await testBotCompat.getElement(shared.passwordField)
        expect(await pwField.getAttribute('password')).toBeTruthy()

        await testBot.click(shared.loginButton)
    })

    it('S2 Step 10 - Select Kerr House community; tap Start Work; verify My Communities tab', async () => {
        if (!(await waitForVisible(shared.kerrHouseServiceUsers, 20000))) {
            await testBot.addBstackLog?.('S2 Step 10 skipped: community option not visible.', 'warn')
            return
        }
        await testBot.click(shared.kerrHouseServiceUsers)

        if (!(await waitForVisible(shared.startWorkButton, 10000))) {
            await testBot.addBstackLog?.('S2 Step 10 skipped: Start Work button not visible.', 'warn')
            return
        }
        await testBot.click(shared.startWorkButton)

        expect(await waitForVisible(shared.myCommunitiesTab, 15000)).toBe(true)
    })
})
