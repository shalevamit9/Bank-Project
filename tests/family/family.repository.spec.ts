import { expect } from "chai";
import connectDb from "../../src/db/mysql.connection";
import familyRepository from "../../src/modules/family/family.repository";

describe("Family Repository Functions:", () => {
    before(async () => {
        await connectDb();
    });

    context("createFamilyAccount", () => {
        it("should be a function", () => {
            expect(familyRepository.createFamilyAccount).to.be.a("function");
        });
    });

    context("getFamilyById", () => {
        it("should be a function", () => {
            expect(familyRepository.getFamilyById).to.be.a("function");
        });
    });

    context("getFamilyOwnersIds", () => {
        it("should be a function", () => {
            expect(familyRepository.getFamilyOwnersIds).to.be.a("function");
        });
    });

    context("getShortFamilyDetails", () => {
        it("should be a function", () => {
            expect(familyRepository.getShortFamilyDetails).to.be.a("function");
        });
    });

    context("getFullFamilyDetails", () => {
        it("should be a function", () => {
            expect(familyRepository.getFullFamilyDetails).to.be.a("function");
        });
    });

    context("addMembersToFamily", () => {
        it("should be a function", () => {
            expect(familyRepository.addMembersToFamily).to.be.a("function");
        });
    });

    context("removeMembersFromFamily", () => {
        it("should be a function", () => {
            expect(familyRepository.removeMembersFromFamily).to.be.a(
                "function"
            );
        });
    });

    context("closeFamilyAccount", () => {
        it("should be a function", () => {
            expect(familyRepository.closeFamilyAccount).to.be.a("function");
        });
    });
});
