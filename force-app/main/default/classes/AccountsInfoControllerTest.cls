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
        List<String> fieldSetNameList = new List<String>();
        List<String> fieldSetTypeList = new List<String>();
        List<String> fieldSetLabelList = new List<String>();
        List<String> nameUpdateableList = new List<String>();

        for (Schema.FieldSetMember f : fieldSet) {
            if (!f.getFieldPath().contains('.')) {
                fieldSetNameList.add(f.getFieldPath());
                fieldSetTypeList.add(String.valueOf(f.getType()));
                fieldSetLabelList.add(f.getLabel());
                Schema.DescribeFieldResult describeFieldResult =
                    Schema.getGlobalDescribe().get('Account').getDescribe().fields.getMap().get(f.getFieldPath()).getDescribe();
                if (describeFieldResult.isUpdateable()) {
                    nameUpdateableList.add(f.getFieldPath());
                }
            }
        }

        if (!fieldSetNameList.contains('Name')) {
            fieldSetNameList.add(0, 'Name');
            fieldSetTypeList.add(0, 'TEXT');
            fieldSetLabelList.add(0, 'Account Name');
            nameUpdateableList.add(0, 'Name');
        }

        System.assertEquals(resultList.accounts.size(), listAccounts.size());
        System.assertEquals(resultList.accountFields.size(), fieldSetNameList.size());
        System.assertEquals(resultList.accountUpdateableColumns.size(), nameUpdateableList.size());
        System.assertEquals(resultList.accountColumns.size(), fieldSetTypeList.size());
        System.assertEquals(resultList.accountCount, 1);
        System.assertEquals(resultList.accountFieldTypes.size(), fieldSetTypeList.size());
    }
}
