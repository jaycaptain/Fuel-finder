"use client";

import type { Predicate } from "@fuel-explorer/graphql";
import { VStack } from "@fuels/ui";
import { CodeBlock } from "~/systems/Core/components/CodeBlock/CodeBlock";

export type AccountPredicateProps = {
	predicate?: Predicate;
	id: string;
	isLoading?: boolean;
};

export function AccountPredicate({
	predicate,
	isLoading,
}: AccountPredicateProps) {
	if (!predicate) {
		return null;
	}

	return (
		<VStack gap="6">
			<CodeBlock
				value={predicate?.bytecode || ""}
				title="Byte code"
				isLoading={isLoading}
			/>
		</VStack>
	);
}
