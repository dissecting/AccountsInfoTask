@isTest
private class AccountsInfoControllerTest {

    @testSetup
    private static void prepareData() {
        List<Account> prepareAccountsList = new List<Account>();
        Account account = new Account (
            Name = 'TestName1',
            Phone = '(212) 842-5500'
        );
        prepareAccountsList.add(account);
        insert prepareAccountsList;
    }

	@isTest
    private static void getAccountsTest() {
        List<Account> accountsList = [
            SELECT Name, Phone
            FROM Account
        ];

        Test.startTest();
        AccountsInfoController.AccountsWithFields resultList = AccountsInfoController.getAccountList(1, 1);
        Test.stopTest();

        List<Account> listAccounts = [
            SELECT Name, Phone
            FROM Account
        ];
        List<Schema.FieldSetMember> fieldSet = SObjectType.Account.FieldSets.AccountFieldSet.getFields();
        List<String> fieldSetItems = new List<String>();
        List<String> fieldSetTypeList = new List<String>();

        for (Schema.FieldSetMember f : fieldSet) {
            fieldSetItems.add(f.getFieldPath());
            fieldSetTypeList.add(String.valueOf(f.getType()));
        }

        if (!fieldSetItems.contains('Name')) {
            fieldSetItems.add(0, 'Name');
            fieldSetTypeList.add(0, 'TEXT');
        }

        System.assertEquals(resultList.accounts.size(), listAccounts.size());
        System.assertEquals(resultList.accountFields.size(), fieldSetItems.size());
        System.assertEquals(resultList.accountCount, 1);
        System.assertEquals(resultList.accountFieldTypes.size(), fieldSetTypeList.size());
    }
}
